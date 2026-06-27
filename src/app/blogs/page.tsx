import BlogsClient, { Article } from "./BlogsClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 3600; // Revalidate every 1 hour (ISR)

const WORDPRESS_POSTS_URL = "https://admin.homeo.healthcare/wp-json/wp/v2/posts";
const WORDPRESS_LIST_FIELDS = [
  "id",
  "slug",
  "date",
  "title.rendered",
  "excerpt.rendered",
].join(",");

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
  "constitutional-immunotherapy-cancer"
]);

function decodeHtmlEntities(html: string): string {
  if (!html) return "";
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
    .replace(/&#8211;/g, "–")
    .replace(/&ndash;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&mdash;/g, "—")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function getWordPressPosts(): Promise<Article[]> {
  try {
    let allPosts: any[] = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore && page <= 5) {
      const params = new URLSearchParams({
        _fields: WORDPRESS_LIST_FIELDS,
        per_page: "100",
        page: page.toString(),
      });
      const res = await fetch(`${WORDPRESS_POSTS_URL}?${params.toString()}`, {
        next: { revalidate: 3600 }
      });
      if (!res.ok) {
        hasMore = false;
        break;
      }
      const posts = await res.json();
      if (!Array.isArray(posts) || posts.length === 0) {
        hasMore = false;
      } else {
        allPosts = [...allPosts, ...posts];
        if (posts.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    if (allPosts.length === 0) {
      console.warn("No posts fetched from WordPress API");
      return [];
    }
    
    const mapped: Article[] = allPosts.map((post: any) => {
      const title = decodeHtmlEntities((post.title?.rendered || "").replace(/\\n/g, ""));
      const renderedExcerpt = decodeHtmlEntities((post.excerpt?.rendered || "").replace(/\\n/g, ""));

      // Extract category
      let category: Article["category"] = "Research";
      try {
        const titleLower = title.toLowerCase();

        // Title keyword check first
        if (['skin', 'eczema', 'psoriasis', 'liver', 'gall', 'digest', 'stomach', 'gut', 'acne', 'gerd', 'acidity', 'constipation', 'abdomen', 'gastric', 'bowel', 'ibs', 'crohn', 'ulcer', 'fistula', 'fissure', 'piles', 'hemorrhoid', 'pancreas', 'digestive'].some(w => titleLower.includes(w))) {
          category = "Skin & Digestive";
        } else if (['asthma', 'bronchial', 'lung', 'throat', 'sinus', 'cough', 'rhinitis', 'respiratory', 'breathing', 'copd', 'cold', 'tonsil', 'adenoid', 'sneeze'].some(w => titleLower.includes(w))) {
          category = "Respiratory & Lungs";
        } else if (['diabetes', 'thyroid', 'hormon', 'endocrine', 'gland', 'pcos', 'obesity', 'metabolic', 'weight', 'insulin', 'adrenal', 'goitre', 'pcod', 'hormonal'].some(w => titleLower.includes(w))) {
          category = "Hormones & Diabetes";
        } else if (['heart', 'lipid', 'cholesterol', 'triglyceride', 'cardio', 'blood pressure', 'hypertension', 'angina', 'artery', 'vascular', 'circulat', 'cardiac'].some(w => titleLower.includes(w))) {
          category = "Heart & Lipids";
        } else if (['joint', 'spondylosis', 'neck', 'spine', 'arthritis', 'rheumat', 'bone', 'neuro', 'back', 'sciatica', 'gout', 'muscul', 'paralysis', 'neuropathy', 'headache', 'migraine', 'disc', 'lumbar', 'nerve'].some(w => titleLower.includes(w))) {
          category = "Joints & Neuro";
        } else if (['kidney', 'urolog', 'renal', 'urine', 'bladder', 'prostate', 'calculi', 'stone', 'uti', 'nephro'].some(w => titleLower.includes(w))) {
          category = "Kidney & Urology";
        } else if (['infect', 'viral', 'fever', 'immun', 'flu', 'covid', 'chickenpox', 'measles', 'allergy', 'allergies', 'parasite', 'bacteri', 'autoimmune'].some(w => titleLower.includes(w))) {
          category = "Immunity & Infections";
        } else if (['diet', 'nutrition', 'stress', 'summer', 'health care', 'lifestyle', 'prevent', 'detox', 'sleep', 'wellness', 'anxiety', 'depress', 'mental', 'mind', 'insomnia', 'fatigue', 'fitness', 'exercise'].some(w => titleLower.includes(w))) {
          category = "Lifestyle & Wellness";
        } else if (['cancer', 'oncology', 'tumor', 'malignan', 'chemo', 'radiat'].some(w => titleLower.includes(w))) {
          category = "Cancer Care";
        } else if (['kids', 'child', 'pediatric', 'infant', 'baby', 'toddler', 'autism', 'adhd'].some(w => titleLower.includes(w))) {
          category = "Children's Health";
        }
      } catch {}

      // Determine glowColor
      const glowColors: Record<Article["category"], string> = {
        "Skin": "rgba(20,184,166,0.15)",
        "Lungs": "rgba(6,182,212,0.15)",
        "Children's Health": "rgba(245,158,11,0.15)",
        "Gut & Hormones": "rgba(16,185,129,0.15)",
        "Joints & Neuro": "rgba(168,85,247,0.15)",
        "Research": "rgba(99,102,241,0.15)",
        "Homeopathy": "rgba(20,184,166,0.15)",
        "Healthcare": "rgba(14,165,233,0.15)",
        "Heart Care": "rgba(244,63,94,0.15)",
        "Cancer Care": "rgba(99,102,241,0.15)",
        "Skin & Digestive": "rgba(20,184,166,0.15)",
        "Respiratory & Lungs": "rgba(6,182,212,0.15)",
        "Hormones & Diabetes": "rgba(232,121,249,0.15)",
        "Heart & Lipids": "rgba(244,63,94,0.15)",
        "Kidney & Urology": "rgba(14,165,233,0.15)",
        "Immunity & Infections": "rgba(16,185,129,0.15)",
        "Lifestyle & Wellness": "rgba(99,102,241,0.15)"
      };

      // Get featured image: prefer local unwatermarked image, fallback to WordPress featured media URL
      let image = "/images/epigenetics_gene.png";
      if (localSlugsWithFeaturedImage.has(post.slug)) {
        image = `/images/${post.slug}-featured.png`;
      }

      // Get excerpt
      const excerpt = renderedExcerpt
        ? renderedExcerpt.replace(/<[^>]*>/g, '').replace(/\[&hellip;\]/, '...').trim()
        : "";

      // Calculate read time
      const wordCount = excerpt ? excerpt.split(/\s+/).length : 0;
      const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;

      // Format Date
      const date = new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      return {
        id: post.slug || post.id.toString(),
        title: title || "Untitled Post",
        category,
        date,
        readTime,
        author: "Dr. Narayan Jethwani",
        excerpt,
        content: "",
        glowColor: glowColors[category],
        image
      };
    });

    return mapped;
  } catch (err) {
    console.error("Error fetching live posts server-side:", err);
    return [];
  }
}

export default async function BlogsPage() {
  const initialArticles = await getWordPressPosts();
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-mint font-mono">Loading...</div>}>
      <BlogsClient initialArticles={initialArticles} />
    </Suspense>
  );
}

async function getWordPressPostBySlug(slug: string): Promise<Article | null> {
  try {
    const params = new URLSearchParams({
      slug,
      _fields: "id,slug,title.rendered,excerpt.rendered",
    });
    const res = await fetch(`${WORDPRESS_POSTS_URL}?${params.toString()}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    const post = posts[0];

    let image = "/images/epigenetics_gene.png";
    if (localSlugsWithFeaturedImage.has(post.slug)) {
      image = `/images/${post.slug}-featured.png`;
    }

    const excerpt = post.excerpt?.rendered 
      ? post.excerpt.rendered.replace(/<[^>]*>/g, '').replace(/\[&hellip;\]/, '...').replace(/\\n/g, "").trim()
      : "";

    return {
      id: post.slug || post.id.toString(),
      title: decodeHtmlEntities(post.title?.rendered || "Untitled Post"),
      category: "Research",
      date: "",
      readTime: "",
      author: "",
      excerpt,
      content: "",
      glowColor: "",
      image
    };
  } catch (err) {
    console.error("Error fetching single post by slug for metadata:", err);
    return null;
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const articleId = typeof resolvedParams.article === "string" ? resolvedParams.article : undefined;

  const defaultMeta = {
    title: "Science & Healing Blog | Homeo Healthcare",
    description: "Read clinical essays, case studies, and nanotechnology-based evidence for advanced homeopathy written by Dr. Narayan Jethwani.",
    openGraph: {
      title: "Science & Healing Blog | Homeo Healthcare",
      description: "Read clinical essays, case studies, and nanotechnology-based evidence for advanced homeopathy written by Dr. Narayan Jethwani.",
      url: "https://homeo.healthcare/blogs",
      siteName: "Homeo Healthcare",
      locale: "en_US",
      type: "website",
    }
  };

  if (!articleId) {
    return defaultMeta;
  }

  // 1. Static Migraine Article
  if (articleId === "migraine-uiux") {
    return {
      title: "Beyond the Headache: Visualizing Migraine Pathways | Homeo Healthcare",
      description: "An in-depth clinical and visual communication analysis of migraine pathophysiology, triggers, and personalized homeopathic care, designed for high-clarity patient education.",
      openGraph: {
        title: "Beyond the Headache: Visualizing Migraine Pathways | Homeo Healthcare",
        description: "An in-depth clinical and visual communication analysis of migraine pathophysiology, triggers, and personalized homeopathic care, designed for high-clarity patient education.",
        url: "https://homeo.healthcare/blogs?article=migraine-uiux",
        images: [
          {
            url: "https://homeo.healthcare/images/migraine_article_hero.png",
            width: 1200,
            height: 630,
            alt: "Beyond the Headache: Visualizing Migraine Pathways",
          }
        ],
        siteName: "Homeo Healthcare",
        locale: "en_US",
        type: "article",
      }
    };
  }

  // 2. Fetch WordPress dynamic post
  const matched = await getWordPressPostBySlug(articleId);
  if (matched) {
    let imageUrl = matched.image;
    if (imageUrl && imageUrl.startsWith("/")) {
      imageUrl = `https://homeo.healthcare${imageUrl}`;
    }
    return {
      title: `${matched.title} | Homeo Healthcare`,
      description: matched.excerpt || defaultMeta.description,
      openGraph: {
        title: `${matched.title} | Homeo Healthcare`,
        description: matched.excerpt || defaultMeta.description,
        url: `https://homeo.healthcare/blogs?article=${matched.id}`,
        images: imageUrl ? [{ url: imageUrl, alt: matched.title }] : [],
        siteName: "Homeo Healthcare",
        locale: "en_US",
        type: "article",
      }
    };
  }

  return defaultMeta;
}
