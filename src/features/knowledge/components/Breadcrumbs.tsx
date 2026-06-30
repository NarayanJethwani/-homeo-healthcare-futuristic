import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbSchema } from "../schemas/jsonLdSchemas";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbsProps {
  crumbs: BreadcrumbItem[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const fullCrumbs = [
    { name: "Home", item: "https://homeo.healthcare" },
    { name: "Knowledge Hub", item: "https://homeo.healthcare/knowledge" },
    ...crumbs,
  ];

  const schemaJson = generateBreadcrumbSchema(fullCrumbs);

  return (
    <div className="mb-6">
      {/* Inject breadcrumb schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1">
          <Home className="h-3 w-3" />
        </Link>
        
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 opacity-60" />
            {idx === crumbs.length - 1 ? (
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">
                {crumb.name}
              </span>
            ) : (
              <Link href={crumb.item.replace("https://homeo.healthcare", "")} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {crumb.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}
