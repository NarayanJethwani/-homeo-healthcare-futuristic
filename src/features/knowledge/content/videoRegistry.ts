export interface KnowledgeVideo {
  src: string;
  poster: string;
  captions: string;
  title: string;
  description: string;
}

/**
 * Topic video is deliberately opt-in. This keeps all videos editorially
 * reviewable and prevents an unrelated topic page from loading media.
 */
export const KNOWLEDGE_VIDEOS: Record<string, KnowledgeVideo> = {
  headache: {
    src: "/videos/homeo-headache-education-v1.mp4",
    poster: "/videos/homeo-headache-poster.jpg",
    captions: "/videos/homeo-headache-education-v1.vtt",
    title: "Headache: notice the pattern",
    description: "A 30-second patient education video about common contributors, simple steps for a familiar mild headache, and when to seek urgent care.",
  },
};

export function getKnowledgeVideo(slug: string): KnowledgeVideo | undefined {
  return KNOWLEDGE_VIDEOS[slug];
}
