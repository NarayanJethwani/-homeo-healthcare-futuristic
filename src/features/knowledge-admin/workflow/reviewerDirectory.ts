export interface EditorialReviewer {
  id: string;
  name: string;
  role: string;
  specialties?: string[];
  active: boolean;
  maxOpenTasks?: number;
  email?: string;
}

export const EDITORIAL_REVIEWERS: EditorialReviewer[] = [
  {
    id: "rev-1",
    name: "Dr. Narayan Jethwani",
    role: "Lead Clinician Reviewer",
    specialties: ["Remedy Safety", "Clinical Repertory", "Materia Medica"],
    active: true,
    maxOpenTasks: 10,
    email: "dr.jethwani@homeo.healthcare"
  },
  {
    id: "rev-2",
    name: "Dr. Amit Patel",
    role: "Senior Editorial Reviewer",
    specialties: ["Pathology Management", "Clinical Diagnostics"],
    active: true,
    maxOpenTasks: 8,
    email: "dr.patel@homeo.healthcare"
  },
  {
    id: "rev-3",
    name: "Dr. Sarah Jenkins",
    role: "Curation & SEO Reviewer",
    specialties: ["Citation Health", "Patient Accessibility"],
    active: true,
    maxOpenTasks: 5,
    email: "dr.jenkins@homeo.healthcare"
  }
];
