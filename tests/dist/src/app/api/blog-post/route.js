"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const WORDPRESS_POSTS_URL = "https://admin.homeo.healthcare/wp-json/wp/v2/posts";
const WORDPRESS_POST_FIELDS = [
    "id",
    "slug",
    "date",
    "title.rendered",
    "excerpt.rendered",
    "content.rendered",
    "jetpack_featured_media_url",
].join(",");
const DEFAULT_BLOG_IMAGE = "/images/epigenetics_gene.png";
const localSlugsWithFeaturedImage = new Set([
    "complete-thyroid-guide",
    "hashimotos-thyroiditis",
    "hyperthyroidism-graves",
    "chronic-respiratory-guide",
    "allergic-rhinitis-sinusitis",
    "asthma-bronchospasms",
    "gut-brain-skin-axis",
    "ibs-gut-motility",
    "gerd-acid-reflux",
    "chronic-skin-pathology",
    "eczema-barrier-repair",
    "vitiligo-repigmentation",
    "joint-bone-health",
    "osteoarthritis-degradation",
    "sciatica-spine-care",
    "neurobiology-stress-anxiety",
    "insomnia-sleep-rhythms",
    "female-endocrine-blueprint",
    "pcos-pcod-reversal",
    "insulin-resistance-diabetes",
    "fatty-liver-regeneration",
    "cardiovascular-hypertension-lipids",
    "pediatric-immunity-tonsils",
    "recurrent-childhood-fevers",
    "constitutional-immunotherapy-cancer",
]);
function decodeHtmlEntities(html) {
    if (!html)
        return "";
    return html
        .replace(/&#038;/g, "&")
        .replace(/&amp;/g, "&")
        .replace(/&#8217;/g, "'")
        .replace(/&#8216;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&lsquo;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&#8211;/g, "-")
        .replace(/&ndash;/g, "-")
        .replace(/&#8212;/g, "-")
        .replace(/&mdash;/g, "-")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}
function sanitizeWordPressImageUrl(url) {
    if (!url)
        return "";
    const jetpackMatch = url.match(/^https?:\/\/i[0-9]\.wp\.com\/([^\?]+)/);
    if (jetpackMatch && jetpackMatch[1]) {
        return `https://${jetpackMatch[1]}`;
    }
    const queryIndex = url.indexOf("?");
    if (queryIndex !== -1) {
        return url.substring(0, queryIndex);
    }
    return url;
}
function getPostImage(post) {
    if (localSlugsWithFeaturedImage.has(post.slug)) {
        return `/images/${post.slug}-featured.png`;
    }
    const rawUrl = post.jetpack_featured_media_url;
    return rawUrl ? sanitizeWordPressImageUrl(rawUrl) : DEFAULT_BLOG_IMAGE;
}
function buildArticle(post) {
    const rawContent = post.content?.rendered || "";
    const content = rawContent
        .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
        .replace(/\\n/g, "");
    const excerpt = decodeHtmlEntities((post.excerpt?.rendered || "").replace(/\\n/g, ""))
        .replace(/<[^>]*>/g, "")
        .replace(/\[&hellip;\]/, "...")
        .trim();
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    const image = getPostImage(post);
    return {
        id: post.slug || post.id.toString(),
        title: decodeHtmlEntities((post.title?.rendered || "Untitled Post").replace(/\\n/g, "")),
        category: "Research",
        date: post.date
            ? new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : "",
        readTime: `${Math.max(3, Math.ceil(wordCount / 200))} min read`,
        author: "Dr. Narayan Jethwani",
        excerpt,
        content,
        glowColor: "rgba(99,102,241,0.15)",
        image,
    };
}
async function GET(request) {
    const slug = request.nextUrl.searchParams.get("slug")?.trim();
    if (!slug || !/^[a-z0-9-]{1,160}$/.test(slug)) {
        return server_1.NextResponse.json({ error: "Invalid blog slug" }, { status: 400 });
    }
    const params = new URLSearchParams({
        slug,
        _fields: WORDPRESS_POST_FIELDS,
    });
    try {
        const response = await fetch(`${WORDPRESS_POSTS_URL}?${params.toString()}`, {
            next: { revalidate: 3600 },
        });
        if (!response.ok) {
            return server_1.NextResponse.json({ error: "Blog post unavailable" }, { status: 502 });
        }
        const posts = await response.json();
        if (!Array.isArray(posts) || posts.length === 0) {
            return server_1.NextResponse.json({ error: "Blog post not found" }, { status: 404 });
        }
        return server_1.NextResponse.json(buildArticle(posts[0]), {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
        });
    }
    catch (error) {
        console.error("Error fetching WordPress blog post:", error);
        return server_1.NextResponse.json({ error: "Blog post unavailable" }, { status: 502 });
    }
}
