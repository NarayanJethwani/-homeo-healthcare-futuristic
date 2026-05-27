import { NextResponse } from "next/server";
import https from "https";

// Robust network helper that tries Next.js native fetch (with revalidation cache)
// and falls back to Node's native https module if fetch fails or is blocked.
async function fetchHtml(url: string): Promise<string> {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
  };

  try {
    const response = await fetch(url, { headers, next: { revalidate: 86400 } });
    if (response.ok) {
      return await response.text();
    }
    console.warn(`Native fetch returned status ${response.status} for ${url}, trying fallback https...`);
  } catch (err) {
    console.warn(`Native fetch failed for ${url}, trying fallback https:`, err);
  }

  // Fallback using raw Node https.get
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers
    };

    const req = https.get(options, (res) => {
      // Handle HTTP redirects (301, 302)
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          const absoluteRedirect = redirectUrl.startsWith("http")
            ? redirectUrl
            : `https://${urlObj.hostname}${redirectUrl}`;
          fetchHtml(absoluteRedirect).then(resolve).catch(reject);
          return;
        }
      }

      if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        reject(new Error(`Target site returned status code ${res.statusCode}`));
        return;
      }

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const author = searchParams.get("author");
    const path = searchParams.get("path");

    if (!author && !path) {
      return NextResponse.json(
        { success: false, message: "Missing parameter: 'author' or 'path' is required." },
        { status: 400 }
      );
    }

    // CASE 1: Fetch and parse list of remedies for a specific author book
    if (author) {
      const sanitizedAuthor = encodeURIComponent(author.trim());
      const targetUrl = `https://www.materiamedica.info/en/materia-medica/${sanitizedAuthor}/index`;
      console.log(`Fetching Materia Medica index from: ${targetUrl}`);

      const html = await fetchHtml(targetUrl);

      // Extract the remedy list container
      const remedyListMatch = html.match(/<div class=['"]remedy_list['"]>([\s\S]*?)<\/div>/);
      if (!remedyListMatch) {
        throw new Error("Could not locate remedy list container on page.");
      }

      const listHtml = remedyListMatch[1];
      const linkRegex = /<a\s+href=['"]([^'"]+)['"]>([\s\S]*?)<\/a>/g;
      let match;
      const remedies: Array<{ name: string; path: string }> = [];

      while ((match = linkRegex.exec(listHtml)) !== null) {
        const remedyPath = match[1].trim();
        const rawName = match[2].trim();

        // Skip non-remedy paths (e.g. indexes, prefaces, titles, empty links)
        if (
          remedyPath.endsWith("/index") ||
          rawName.toLowerCase() === "index" ||
          rawName.toLowerCase().startsWith("-preface") ||
          rawName.toLowerCase().startsWith("preface") ||
          remedyPath === "#"
        ) {
          continue;
        }

        // Clean up dashes in the remedy name
        const cleanName = rawName
          .replace(/-/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        remedies.push({
          name: cleanName,
          path: remedyPath
        });
      }

      // Sort alphabetically
      remedies.sort((a, b) => a.name.localeCompare(b.name));

      return NextResponse.json({
        success: true,
        author,
        count: remedies.length,
        remedies
      });
    }

    // CASE 2: Fetch and parse a specific remedy detail page
    if (path) {
      // Validate path format to prevent directory traversal
      if (!path.startsWith("/en/materia-medica/")) {
        return NextResponse.json(
          { success: false, message: "Invalid path parameter format." },
          { status: 400 }
        );
      }

      const targetUrl = `https://www.materiamedica.info${path}`;
      console.log(`Fetching Materia Medica remedy details from: ${targetUrl}`);

      const html = await fetchHtml(targetUrl);

      // Extract Remedy Title
      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
      let title = "Remedy Details";
      if (titleMatch) {
        // Clean up title text (e.g. "ACETIC ACID from Materia Medica by...")
        title = titleMatch[1]
          .split("from")[0]
          .split("Materia")[0]
          .replace(/-/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      // Locate start of main body copy (after header navbar/book info)
      let content = "";
      const h1Index = html.indexOf("</h1>");
      if (h1Index !== -1) {
        content = html.substring(h1Index + 5);
      } else {
        const h2Index = html.indexOf("</h2>");
        if (h2Index !== -1) {
          content = html.substring(h2Index + 5);
        } else {
          // Fallback after navbar container
          const navbarIndex = html.indexOf('class="navbar"');
          if (navbarIndex !== -1) {
            content = html.substring(navbarIndex);
            const navEnd = content.indexOf("</div>");
            if (navEnd !== -1) {
              content = content.substring(navEnd + 6);
            }
          } else {
            content = html;
          }
        }
      }

      // Terminate before the buy/order/remedia links box
      const remediaIndex = content.indexOf('<div id="remediaLink"');
      if (remediaIndex !== -1) {
        content = content.substring(0, remediaIndex);
      } else {
        const remediaClassIndex = content.indexOf('<div class="remediaLink"');
        if (remediaClassIndex !== -1) {
          content = content.substring(0, remediaClassIndex);
        } else {
          const footerIndex = content.indexOf("</main>");
          if (footerIndex !== -1) {
            content = content.substring(0, footerIndex);
          }
        }
      }

      // Clean up final content spacing and closing div fragments
      content = content.trim();
      
      // If there's a trailing closing div like </div></div>, clean it up
      while (content.endsWith("</div>")) {
        content = content.substring(0, content.length - 6).trim();
      }

      return NextResponse.json({
        success: true,
        path,
        title,
        content
      });
    }

  } catch (error: any) {
    console.error("Materia Medica API failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to scrape Materia Medica content from knowledge hub.",
        error: error.message || error
      },
      { status: 500 }
    );
  }
}
