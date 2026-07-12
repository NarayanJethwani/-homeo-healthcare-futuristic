import { RepertoryParserProfile } from '../types';

export const CLARKE_PARSER_PROFILE: RepertoryParserProfile = {
  sourceId: "clarke_clinical_1904",
  parserVersion: "1.0.0",
  initialState: "front-matter",
  
  stateTransitions: [
    {
      fromState: "front-matter",
      toState: "clinical",
      triggerRuleId: "start-clinical-section"
    },
    {
      fromState: "clinical",
      toState: "causation",
      triggerRuleId: "start-causation-section"
    },
    {
      fromState: "causation",
      toState: "temperaments",
      triggerRuleId: "start-temperaments-section"
    },
    {
      fromState: "temperaments",
      toState: "clinical-relationships",
      triggerRuleId: "start-clinical-relationships-section"
    },
    {
      fromState: "clinical-relationships",
      toState: "natural-relationships",
      triggerRuleId: "start-natural-relationships-section"
    },
    {
      fromState: "natural-relationships",
      toState: "index",
      triggerRuleId: "start-index-section"
    }
  ],

  pageAnchorRules: [
    {
      id: "page-anchor",
      pattern: "^Page\\s+(\\d+)",
      description: "Match physical/printed page number indicators."
    }
  ],

  sectionRules: [
    {
      id: "start-clinical-section",
      pattern: "^\\s*\\[The name of",
      description: "Start of Clinical Section"
    },
    {
      id: "start-causation-section",
      pattern: "^PART II\\.?\\s*$|^PART IL\\.?\\s*$",
      description: "Start of Repertory of Causation"
    },
    {
      id: "start-temperaments-section",
      pattern: "^PART III\\.?\\s*$",
      description: "Start of Temperaments / Conditions of Client"
    },
    {
      id: "start-clinical-relationships-section",
      pattern: "^PART IV\\.?\\s*$",
      description: "Start of Clinical Relationships"
    },
    {
      id: "start-natural-relationships-section",
      pattern: "^PART V\\.?\\s*$",
      description: "Start of Natural Relationships / Schema"
    },
    {
      id: "start-index-section",
      pattern: "^INDEX OF CLINICAL REPERTORY\\s*$",
      description: "Start of Index Section"
    }
  ],

  rubricRules: [
    {
      id: "main-rubric",
      pattern: "^[A-Z][A-Z\\s,\\-\\(\\)\\?\\/]+:$",
      description: "Main rubric ending with colon"
    },
    {
      id: "main-rubric-fallback",
      pattern: "^[A-Z][A-Z\\s,\\-\\(\\)\\?\\/]{3,}$",
      description: "Main rubric uppercase line without colon"
    }
  ],

  subRubricRules: [
    {
      id: "sub-rubric-bullet",
      pattern: "^\\s+-\\s*(.+)",
      description: "Sub-rubric marked with single hyphen"
    },
    {
      id: "sub-rubric-double-bullet",
      pattern: "^\\s+--\\s*(.+)",
      description: "Second-level sub-rubric"
    },
    {
      id: "sub-rubric-indent",
      pattern: "^\\s{2,}([a-z].+)",
      description: "Indented lowercase sub-rubric"
    }
  ],

  remedyContinuationRules: [
    {
      id: "remedy-list",
      pattern: "^\\s{2,}([a-z]{3,4}(?:,\\s*[a-z]{3,4})*\\.?)$",
      description: "Indented remedy abbreviations line"
    }
  ],

  crossReferenceRules: [
    {
      id: "see-also",
      pattern: "\\bSee\\s+also\\s+([A-Za-z\\s,]+)",
      description: "Cross reference indicator"
    }
  ],

  pageHeaderRules: [
    {
      id: "header-title",
      pattern: "^CLINICAL\\s+REPERTORY|^REPERTORY\\s+OF|^CLARKE'S\\s+REPERTORY",
      description: "Running header text"
    }
  ],

  pageFooterRules: [
    {
      id: "footer-num",
      pattern: "^\\d+$",
      description: "Page number at the bottom"
    }
  ],

  ignoredLineRules: [
    {
      id: "blank-line",
      pattern: "^\\s*$",
      description: "Blank lines"
    },
    {
      id: "divider",
      pattern: "^[-_=\\*\\s]{5,}$",
      description: "Visual divider lines"
    }
  ],

  gradeRules: [
    {
      sourceRepresentation: "italics",
      normalizedGrade: 2,
      detectionRule: {
        id: "grade-2-italics",
        pattern: "_([A-Za-z0-9]+)_|\\*([A-Za-z0-9]+)\\*"
      }
    },
    {
      sourceRepresentation: "capitals",
      normalizedGrade: 3,
      detectionRule: {
        id: "grade-3-caps",
        pattern: "\\b([A-Z]{3,})\\b"
      }
    },
    {
      sourceRepresentation: "ordinary",
      normalizedGrade: 1,
      detectionRule: {
        id: "grade-1-plain",
        pattern: "\\b([a-z]{3,})\\b"
      }
    }
  ],

  lineContinuationRules: [
    {
      id: "lowercase-start",
      pattern: "^\\s*[a-z]"
    }
  ],

  hyphenationRules: [
    {
      id: "dash-end",
      pattern: "-$"
    }
  ],

  requiredSections: ["clinical", "causation"]
};

export const PARSER_PROFILES: Record<string, RepertoryParserProfile> = {
  "clarke_clinical_1904": CLARKE_PARSER_PROFILE
};

export function getParserProfile(sourceId: string): RepertoryParserProfile | undefined {
  return PARSER_PROFILES[sourceId];
}
