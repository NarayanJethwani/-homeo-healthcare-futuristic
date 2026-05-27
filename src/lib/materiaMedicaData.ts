export interface MateriaMedicaBook {
  id: string;
  title: string;
  author: string;
  year: string;
  description: string;
  wikipediaUrl: string;
  coverBg: string; // Tailwind/CSS classes for gradient backgrounds
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export const MATERIA_MEDICA_BOOKS: MateriaMedicaBook[] = [
  {
    id: "james-tyler-kent",
    title: "Lectures on Homoeopathic Materia Medica",
    author: "James Tyler Kent",
    year: "1905",
    description: "A foundational masterwork of constitutional prescribing, based on Kent's lectures at the Dunham Medical College. Renowned for its vivid, personified descriptions of remedy states and psychological portraits.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/James_Tyler_Kent",
    coverBg: "from-emerald-950 via-teal-900 to-emerald-950",
    borderColor: "border-teal-500/30",
    badgeBg: "bg-teal-500/10",
    badgeText: "text-teal-200"
  },
  {
    id: "william-boericke",
    title: "Pocket Manual of Homoeopathic Materia Medica",
    author: "William Boericke",
    year: "1901",
    description: "An incredibly comprehensive, pocket-sized clinical encyclopedia containing the pathogenetic symptoms of all prominent remedies, including clinical modalities, relationships, and posology guidelines.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/William_Boericke",
    coverBg: "from-blue-950 via-indigo-950 to-blue-950",
    borderColor: "border-indigo-500/30",
    badgeBg: "bg-indigo-500/10",
    badgeText: "text-indigo-200"
  },
  {
    id: "john-henry-clarke",
    title: "A Dictionary of Practical Materia Medica",
    author: "John Henry Clarke",
    year: "1900",
    description: "A massive, three-volume clinical compendium. Known for its extensive section on 'Characteristics' and clinical relationships, bridging classical therapeutics with clinical application.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/John_Henry_Clarke",
    coverBg: "from-stone-900 via-neutral-900 to-stone-900",
    borderColor: "border-amber-500/20",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-200"
  },
  {
    id: "henry-c-allen",
    title: "Keynotes and Characteristics of Leading Remedies",
    author: "Henry C. Allen",
    year: "1899",
    description: "A clinical classic focusing on the key distinguishing features and comparisons of primary remedies. Indispensable for rapid repertorial confirmation and prescribing on guiding symptoms.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Henry_C._Allen",
    coverBg: "from-rose-950 via-red-950 to-rose-950",
    borderColor: "border-rose-500/30",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-200"
  },
  {
    id: "benoit-mure",
    title: "Materia Medica of Brazil",
    author: "Benoît Mure",
    year: "1854",
    description: "A highly specialized, pioneering work detailing the provings and pathogenesy of native South American substances, minerals, plants, and animal venoms introduced into homeopathic science.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Beno%C3%AEt_Jules_Mure",
    coverBg: "from-green-950 via-emerald-950 to-green-950",
    borderColor: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-200"
  },
  {
    id: "cyrus-maxwell-boger",
    title: "Synoptic Key of the Materia Medica",
    author: "Cyrus Maxwell Boger",
    year: "1915",
    description: "A brilliant synthesis of Boenninghausen's logic, focusing on the genius of remedies, physiological modalities, regional symptoms, and diagnostic clinical characteristics.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cyrus_Maxwell_Boger",
    coverBg: "from-violet-950 via-purple-950 to-violet-950",
    borderColor: "border-purple-500/30",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-200"
  },
  {
    id: "adolf-zur-lippe",
    title: "Key to the Materia Medica",
    author: "Adolf zur Lippe",
    year: "1854",
    description: "A concise reference manual emphasizing the diagnostic, characteristic red-line symptoms of remedies. Curated by one of the most successful pure Hahnemannian prescribers in American history.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Adolf_zur_Lippe",
    coverBg: "from-cyan-950 via-slate-900 to-cyan-950",
    borderColor: "border-cyan-500/30",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-200"
  },
  {
    id: "william-boericke-short",
    title: "Materia Medica (Short Version)",
    author: "William Boericke",
    year: "1901",
    description: "An abridged reference guide summarizing key modalities and organ affinity notes from Boericke's manual, optimized for quick-lookup clinic room applications.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/William_Boericke",
    coverBg: "from-slate-950 via-slate-900 to-slate-950",
    borderColor: "border-slate-500/30",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-200"
  }
];
