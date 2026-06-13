import fs from "fs";
import path from "path";
import BlogsClient, { Article } from "./BlogsClient";

export const revalidate = 3600; // Revalidate every 1 hour (ISR)

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
      const res = await fetch(`https://admin.homeo.healthcare/wp-json/wp/v2/posts?_embed&per_page=100&page=${page}`, {
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
      // Clean up literal \n strings from content, excerpt, and title if present
      if (post.content?.rendered) {
        post.content.rendered = post.content.rendered.replace(/\\n/g, "");
      }
      if (post.excerpt?.rendered) {
        post.excerpt.rendered = decodeHtmlEntities(post.excerpt.rendered.replace(/\\n/g, ""));
      }
      if (post.title?.rendered) {
        post.title.rendered = decodeHtmlEntities(post.title.rendered.replace(/\\n/g, ""));
      }

      // Extract category
      let category: Article["category"] = "Research";
      try {
        const title = (post.title?.rendered || "").toLowerCase();
        const terms = post._embedded?.['wp:term']?.[0];
        const catName = (terms && terms.length > 0) ? terms[0].name.toLowerCase() : "";
        const slug = (terms && terms.length > 0) ? (terms[0].slug?.toLowerCase() || "") : "";

        // Title keyword check first
        if (['skin', 'eczema', 'psoriasis', 'liver', 'gall', 'digest', 'stomach', 'gut', 'acne', 'gerd', 'acidity', 'constipation', 'abdomen', 'gastric', 'bowel', 'ibs', 'crohn', 'ulcer', 'fistula', 'fissure', 'piles', 'hemorrhoid', 'pancreas', 'digestive'].some(w => title.includes(w))) {
          category = "Skin & Digestive";
        } else if (['asthma', 'bronchial', 'lung', 'throat', 'sinus', 'cough', 'rhinitis', 'respiratory', 'breathing', 'copd', 'cold', 'tonsil', 'adenoid', 'sneeze'].some(w => title.includes(w))) {
          category = "Respiratory & Lungs";
        } else if (['diabetes', 'thyroid', 'hormon', 'endocrine', 'gland', 'pcos', 'obesity', 'metabolic', 'weight', 'insulin', 'adrenal', 'goitre', 'pcod', 'hormonal'].some(w => title.includes(w))) {
          category = "Hormones & Diabetes";
        } else if (['heart', 'lipid', 'cholesterol', 'triglyceride', 'cardio', 'blood pressure', 'hypertension', 'angina', 'artery', 'vascular', 'circulat', 'cardiac'].some(w => title.includes(w))) {
          category = "Heart & Lipids";
        } else if (['joint', 'spondylosis', 'neck', 'spine', 'arthritis', 'rheumat', 'bone', 'neuro', 'back', 'sciatica', 'gout', 'muscul', 'paralysis', 'neuropathy', 'headache', 'migraine', 'disc', 'lumbar', 'nerve'].some(w => title.includes(w))) {
          category = "Joints & Neuro";
        } else if (['kidney', 'urolog', 'renal', 'urine', 'bladder', 'prostate', 'calculi', 'stone', 'uti', 'nephro'].some(w => title.includes(w))) {
          category = "Kidney & Urology";
        } else if (['infect', 'viral', 'fever', 'immun', 'flu', 'covid', 'chickenpox', 'measles', 'allergy', 'allergies', 'parasite', 'bacteri', 'autoimmune'].some(w => title.includes(w))) {
          category = "Immunity & Infections";
        } else if (['diet', 'nutrition', 'stress', 'summer', 'health care', 'lifestyle', 'prevent', 'detox', 'sleep', 'wellness', 'anxiety', 'depress', 'mental', 'mind', 'insomnia', 'fatigue', 'fitness', 'exercise'].some(w => title.includes(w))) {
          category = "Lifestyle & Wellness";
        } else if (['cancer', 'oncology', 'tumor', 'malignan', 'chemo', 'radiat'].some(w => title.includes(w))) {
          category = "Cancer Care";
        } else if (['kids', 'child', 'pediatric', 'infant', 'baby', 'toddler', 'autism', 'adhd'].some(w => title.includes(w))) {
          category = "Children's Health";
        } else {
          // Fallback to category terms matching
          if (catName.includes("skin") || catName.includes("eczema") || catName.includes("psoriasis")) {
            category = "Skin & Digestive";
          } else if (catName.includes("lung") || catName.includes("respiratory") || catName.includes("asthma")) {
            category = "Respiratory & Lungs";
          } else if (catName.includes("child") || catName.includes("pediatric") || catName.includes("kids") || slug.includes("kids")) {
            category = "Children's Health";
          } else if (catName.includes("gut") || catName.includes("digestive") || catName.includes("hormone") || catName.includes("endocrine")) {
            category = "Skin & Digestive";
          } else if (catName.includes("joint") || catName.includes("neuro") || catName.includes("spine") || catName.includes("headache")) {
            category = "Joints & Neuro";
          } else if (catName.includes("heart") || slug.includes("heart")) {
            category = "Heart & Lipids";
          } else if (catName.includes("cancer") || slug.includes("cancer")) {
            category = "Cancer Care";
          } else if (catName.includes("healthcare") || slug.includes("healthcare")) {
            category = "Healthcare";
          } else if (catName.includes("homeopathy") || slug === "uncategorized") {
            category = "Homeopathy";
          }
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

      if (localSlugsWithFeaturedImage.has(post.slug)) {
        image = `/images/${post.slug}-featured.png`;
      } else {
        try {
          const media = post._embedded?.['wp:featuredmedia']?.[0];
          if (media?.source_url) {
            image = media.source_url;
          }
        } catch {}
      }

      // Get excerpt
      const excerpt = post.excerpt?.rendered 
        ? post.excerpt.rendered.replace(/<[^>]*>/g, '').replace(/\[&hellip;\]/, '...').trim()
        : "";

      // Calculate read time
      const wordCount = post.content?.rendered 
        ? post.content.rendered.replace(/<[^>]*>/g, '').split(/\s+/).length 
        : 0;
      const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} min read`;

      // Format Date
      const date = new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });

      return {
        id: post.slug || post.id.toString(),
        title: post.title?.rendered || "Untitled Post",
        category,
        date,
        readTime,
        author: post._embedded?.author?.[0]?.name || "Dr. Narayan Jethwani",
        excerpt,
        content: post.content?.rendered || "",
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
  return <BlogsClient initialArticles={initialArticles} />;
}
