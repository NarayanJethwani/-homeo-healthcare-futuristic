"use client";

import { useEffect } from "react";
import { trackEntityView } from "../analytics/knowledgeAnalytics";

interface AnalyticsTriggerProps {
  entityId: string;
  slug: string;
  entityType: string;
}

export default function AnalyticsTrigger({ entityId, slug, entityType }: AnalyticsTriggerProps) {
  useEffect(() => {
    trackEntityView(entityId, slug, entityType);
  }, [entityId, slug, entityType]);

  return null; // Invisible component
}
