import { 
  RepertoryParserProfile, 
  RepertoryExtractionRecord, 
  RepertoryParserState,
  RepertoryAcquisitionRecord 
} from '../types';
import { getParserProfile } from './parserProfiles';

export class ClarkeRepertoryParser {
  readonly profile: RepertoryParserProfile;
  readonly acquisitionRecord: RepertoryAcquisitionRecord;

  constructor(acquisitionRecord: RepertoryAcquisitionRecord) {
    this.acquisitionRecord = acquisitionRecord;
    const profile = getParserProfile(acquisitionRecord.sourceId);
    if (!profile) {
      throw new Error(`No parser profile found for source: ${acquisitionRecord.sourceId}`);
    }
    this.profile = profile;
  }

  parse(rawText: string): RepertoryExtractionRecord[] {
    const lines = rawText.split(/\r?\n/);
    const records: RepertoryExtractionRecord[] = [];
    
    let currentState: RepertoryParserState = this.profile.initialState as RepertoryParserState;
    let currentPhysicalPage = 1;
    let currentPrintedPage = "1";
    let currentParentRubric = "";
    let lastMainRubricId = "";

    // Regular expressions compiled from profile rules
    const sectionRegexes = this.profile.stateTransitions.map((t: any) => {
      const rule = this.profile.sectionRules.find((r: any) => r.id === t.triggerRuleId);
      return {
        toState: t.toState,
        triggerRuleId: t.triggerRuleId,
        regex: rule ? new RegExp(rule.pattern, 'i') : null
      };
    });

    const pageAnchorRegex = new RegExp(
      this.profile.pageAnchorRules.find((r: any) => r.id === "page-anchor")?.pattern || "^Page\\s+(\\d+)", 
      'i'
    );

    const separatorRegex = /\s*\.\s*[-—]+\s*|\s+[-—]+\s+|\s*[-—]+\s*/;

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const originalText = lines[i];
      const trimmed = originalText.trim();

      // 1. Skip ignored or blank lines
      if (trimmed === "" || /^[-_=\\*\\s]{5,}$/.test(trimmed) || /Digitized by/i.test(trimmed)) {
        records.push(this.createRecord(lineNum, currentState, originalText, "ignored", 1.0, currentPhysicalPage, currentPrintedPage));
        continue;
      }

      // 2. Check Page Anchor
      const pageMatch = trimmed.match(pageAnchorRegex);
      if (pageMatch) {
        currentPhysicalPage = parseInt(pageMatch[1], 10);
        currentPrintedPage = String(currentPhysicalPage);
        records.push(this.createRecord(lineNum, currentState, originalText, "page-anchor", 1.0, currentPhysicalPage, currentPrintedPage));
        continue;
      }

      // 3. Check Section transitions
      let stateTransitioned = false;
      for (const sectionReg of sectionRegexes) {
        if (sectionReg.regex && sectionReg.regex.test(trimmed)) {
          currentState = sectionReg.toState;
          records.push(this.createRecord(lineNum, currentState, originalText, "section", 1.0, currentPhysicalPage, currentPrintedPage, sectionReg.triggerRuleId));
          stateTransitioned = true;
          break;
        }
      }
      if (stateTransitioned) continue;

      // In Front Matter or Index, we ignore most lines
      if (currentState === "front-matter" || currentState === "index") {
        records.push(this.createRecord(lineNum, currentState, originalText, "ignored", 1.0, currentPhysicalPage, currentPrintedPage));
        continue;
      }

      // 4. Try Main Rubric and Subrubric separator splitting
      const separatorIndex = trimmed.search(separatorRegex);
      if (separatorIndex !== -1) {
        const separatorMatch = trimmed.match(separatorRegex)!;
        const heading = trimmed.substring(0, separatorIndex).trim();
        const remediesText = trimmed.substring(separatorIndex + separatorMatch[0].length).trim();

        if (heading.length > 0) {
          // If heading contains a comma, e.g., "Abdomen, Coldness in"
          if (heading.includes(',')) {
            const commaIndex = heading.indexOf(',');
            const parent = heading.substring(0, commaIndex).trim();
            const child = heading.substring(commaIndex + 1).trim();
            
            currentParentRubric = parent;
            const rubricId = `rubric_${lineNum}`;
            lastMainRubricId = rubricId;

            // Add rubric record for parent
            records.push(this.createRecord(lineNum, currentState, parent, "rubric", 0.95, currentPhysicalPage, currentPrintedPage, "main-rubric", rubricId));
            
            // Add subrubric record for child
            records.push(this.createRecord(lineNum, currentState, `${parent} - ${child}`, "subrubric", 0.9, currentPhysicalPage, currentPrintedPage, "sub-rubric-indent", rubricId));
          } else {
            const isSub = currentParentRubric && (
              /^[a-z]/.test(heading) || 
              /^(•|-)/.test(heading) ||
              /^(distended|large|operations|plethora|swelling|throbbing|after-effects|tendency|threatened|cold)/i.test(heading)
            );

            if (isSub) {
              const fullHeading = `${currentParentRubric} - ${heading}`;
              records.push(this.createRecord(lineNum, currentState, fullHeading, "subrubric", 0.9, currentPhysicalPage, currentPrintedPage, "sub-rubric-indent", lastMainRubricId));
            } else {
              currentParentRubric = heading;
              const rubricId = `rubric_${lineNum}`;
              lastMainRubricId = rubricId;
              records.push(this.createRecord(lineNum, currentState, heading, "rubric", 0.95, currentPhysicalPage, currentPrintedPage, "main-rubric", rubricId));
            }
          }

          // Store the remedies part
          if (remediesText.length > 0) {
            records.push(this.createRecord(lineNum, currentState, remediesText, "remedy-continuation", 0.9, currentPhysicalPage, currentPrintedPage, "remedy-list", lastMainRubricId));
          }
          continue;
        }
      }

      // 5. Try Remedy list line (starts with spaces or contains comma-separated abbreviations)
      if (/^\s{2,}/.test(originalText) && trimmed.length > 0 && lastMainRubricId) {
        records.push(this.createRecord(lineNum, currentState, trimmed, "remedy-continuation", 0.85, currentPhysicalPage, currentPrintedPage, "remedy-list", lastMainRubricId));
      } else {
        records.push(this.createRecord(lineNum, currentState, originalText, "unresolved", 0.3, currentPhysicalPage, currentPrintedPage));
      }
    }

    return records;
  }

  private createRecord(
    lineNum: number,
    state: RepertoryParserState,
    text: string,
    type: RepertoryExtractionRecord["detectedType"],
    confidence: number,
    physPage: number,
    printPage: string,
    ruleId?: string,
    linkedId?: string
  ): RepertoryExtractionRecord {
    return {
      id: `${this.acquisitionRecord.sourceId}_line_${lineNum}`,
      sourceId: this.acquisitionRecord.sourceId,
      acquisitionRecordId: this.acquisitionRecord.id,
      sourceLineNumber: lineNum,
      physicalPageIndex: physPage,
      printedPageNumber: printPage,
      parserState: state,
      originalText: text,
      normalizedText: text.trim(),
      detectedType: type,
      parserRuleId: ruleId,
      parserConfidence: confidence,
      parserVersion: this.profile.parserVersion,
      linkedRubricId: linkedId,
      reviewStatus: "unreviewed"
    };
  }
}
