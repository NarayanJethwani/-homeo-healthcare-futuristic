import { NextResponse } from "next/server";
import https from "https";
import fs from "fs";
import path from "path";

// Robust network helper that tries Next.js native fetch (with revalidation cache)
// and falls back to Node's native https module if fetch fails or is blocked.
async function fetchHtml(url: string): Promise<string> {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9"
  };

  try {
    const response = await fetch(url, { headers, next: { revalidate: 86400 } } as any);
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

import { MATERIA_MEDICA_BOOKS } from "@/lib/materiaMedicaData";

export function isLegacyMateriaMedicaScraperEnabled(): boolean {
  // During migration, if not explicitly defined, we can check for env
  return process.env.LEGACY_MATERIA_MEDICA_SCRAPER_ENABLED === "true";
}

export async function GET(request: Request) {
  try {
    if (!isLegacyMateriaMedicaScraperEnabled()) {
      return NextResponse.json(
        { error: "Legacy Materia Medica source is unavailable." },
        { status: 410 }
      );
    }

    const { searchParams } = new URL(request.url);
    const author = searchParams.get("author");
    const pathParam = searchParams.get("path");

    if (!author && !pathParam) {
      return NextResponse.json(
        { success: false, message: "Missing parameter: 'author' or 'path' is required." },
        { status: 400 }
      );
    }

    const allowedBookIds = new Set(
      MATERIA_MEDICA_BOOKS.map((book) => book.id)
    );

    // CASE 1: Fetch and parse list of remedies for a specific author book
    if (author) {
      const trimmedAuthor = author.trim();
      if (!allowedBookIds.has(trimmedAuthor)) {
        return NextResponse.json({ error: "Unknown book." }, { status: 404 });
      }

      const sanitizedAuthor = encodeURIComponent(trimmedAuthor);
      const cacheDir = path.join(process.cwd(), "src", "lib", "books-cache", sanitizedAuthor);
      const cacheFile = path.join(cacheDir, "index.json");

      if (fs.existsSync(cacheFile)) {
        try {
          const cachedData = fs.readFileSync(cacheFile, "utf-8");
          const parsed = JSON.parse(cachedData);
          return NextResponse.json(parsed);
        } catch (err) {
          console.warn(`Failed to read/parse cache file ${cacheFile}, will re-fetch:`, err);
        }
      }

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

      const responseData = {
        success: true,
        author,
        count: remedies.length,
        remedies
      };

      // Write to cache
      try {
        fs.mkdirSync(cacheDir, { recursive: true });
        fs.writeFileSync(cacheFile, JSON.stringify(responseData, null, 2), "utf-8");
      } catch (err) {
        console.error(`Failed to write cache file ${cacheFile}:`, err);
      }

      return NextResponse.json(responseData);
    }

    // CASE 2: Fetch and parse a specific remedy detail page
    if (pathParam) {
      // Validate path format to prevent directory traversal
      if (!pathParam.startsWith("/en/materia-medica/")) {
        return NextResponse.json(
          { success: false, message: "Invalid path parameter format." },
          { status: 400 }
        );
      }

      // Resolve bookId and remedySlug for caching
      const relativePath = pathParam.substring("/en/materia-medica/".length);
      const parts = relativePath.split("/");
      if (parts.length !== 2) {
        return NextResponse.json(
          { success: false, message: "Invalid path structure." },
          { status: 400 }
        );
      }

      const [bookId, remedySlug] = parts;
      const safeBookRegex = /^[a-zA-Z0-9_\-]+$/;
      const SAFE_REMEDY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

      if (!safeBookRegex.test(bookId) || !SAFE_REMEDY_SLUG.test(remedySlug)) {
        return NextResponse.json(
          { success: false, message: "Invalid characters in path." },
          { status: 400 }
        );
      }

      if (!allowedBookIds.has(bookId)) {
        return NextResponse.json({ error: "Unknown book." }, { status: 404 });
      }

      // Safe immutable path mapping
      type LegacyBookId =
        | "james-tyler-kent"
        | "william-boericke"
        | "john-henry-clarke"
        | "henry-c-allen"
        | "benoit-mure"
        | "cyrus-maxwell-boger"
        | "adolf-zur-lippe"
        | "william-boericke-short";

      const LEGACY_BOOK_SOURCE_PATHS: Record<LegacyBookId, string> = {
        "james-tyler-kent": "james-tyler-kent",
        "william-boericke": "william-boericke",
        "john-henry-clarke": "john-henry-clarke",
        "henry-c-allen": "henry-c-allen",
        "benoit-mure": "benoit-mure",
        "cyrus-maxwell-boger": "cyrus-maxwell-boger",
        "adolf-zur-lippe": "adolf-zur-lippe",
        "william-boericke-short": "william-boericke-short",
      };

      const sourcePath = LEGACY_BOOK_SOURCE_PATHS[bookId as LegacyBookId];
      if (!sourcePath) {
        return NextResponse.json({ error: "Unknown book mapping." }, { status: 404 });
      }

      const cacheDir = path.join(process.cwd(), "src", "lib", "books-cache", bookId);
      const cacheFile = path.join(cacheDir, `${remedySlug}.json`);
      if (fs.existsSync(cacheFile)) {
        try {
          const cachedData = fs.readFileSync(cacheFile, "utf-8");
          const parsed = JSON.parse(cachedData);
          return NextResponse.json(parsed);
        } catch (err) {
          console.warn(`Failed to read/parse cache file ${cacheFile}, will re-fetch:`, err);
        }
      }

      // Construct upstreamUrl using standard URL API, encoding path pieces separately
      const upstreamUrl = new URL(
        `/en/materia-medica/${sourcePath}/${encodeURIComponent(remedySlug)}`,
        "https://www.materiamedica.info"
      );
      const targetUrl = upstreamUrl.toString();
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

      const responseData = {
        success: true,
        path: pathParam,
        title,
        content
      };

      // Write to cache if we resolved a valid cache file path
      if (cacheFile && cacheDir) {
        try {
          fs.mkdirSync(cacheDir, { recursive: true });
          fs.writeFileSync(cacheFile, JSON.stringify(responseData, null, 2), "utf-8");
        } catch (err) {
          console.error(`Failed to write cache file ${cacheFile}:`, err);
        }
      }

      return NextResponse.json(responseData);
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
