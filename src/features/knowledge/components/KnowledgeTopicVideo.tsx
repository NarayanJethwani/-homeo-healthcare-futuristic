import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { getKnowledgeVideo } from "../content/videoRegistry";

interface KnowledgeTopicVideoProps {
  slug: string;
  title: string;
}

/**
 * A native, non-autoplay video player for clinically reviewed topic videos.
 * Native controls keep playback, captions, and data use in the reader's hands.
 */
export default function KnowledgeTopicVideo({ slug, title }: KnowledgeTopicVideoProps) {
  const video = getKnowledgeVideo(slug);

  if (!video) return null;

  const descriptionId = `${slug}-video-description`;

  return (
    <section aria-labelledby={`${slug}-video-title`} className="not-prose rounded-3xl border border-teal-500/20 bg-teal-500/[0.035] p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start gap-2.5">
        <PlayCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">30-second video guide</p>
          <h2 id={`${slug}-video-title`} className="mt-0.5 text-base font-bold text-neutral-900 dark:text-neutral-50">{video.title}</h2>
        </div>
      </div>

      <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-slate-950 shadow-lg ring-1 ring-black/10">
        <video
          className="block aspect-[9/16] w-full bg-black"
          controls
          controlsList="nodownload"
          preload="metadata"
          poster={video.poster}
          aria-describedby={descriptionId}
        >
          <source src={video.src} type="video/mp4" />
          <track kind="captions" src={video.captions} srcLang="en" label="English" default />
          Your browser does not support embedded video. Please open the full {title} guide in a current browser.
        </video>
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/92 px-2 py-1 shadow-sm backdrop-blur dark:bg-slate-950/85">
          <Image src="/images/logo.png" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
          <span className="text-[9px] font-bold tracking-wide text-slate-800 dark:text-white">Homeo Healthcare</span>
        </div>
      </div>

      <p id={descriptionId} className="mx-auto mt-3 max-w-sm text-center text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
        {video.description} Captions are available from the player controls.
      </p>
    </section>
  );
}
