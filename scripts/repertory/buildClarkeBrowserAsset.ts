import fs from "fs";
import path from "path";

type PublishedClarkeRubric = {
  id?: string;
  rubricId?: string;
  chapterId?: string;
  hierarchyPath?: string[];
  displayText?: string;
  title?: string;
  sourceCitation?: string;
};

const version = "v1.2.0";
const sourceId = "clarke_clinical_1904";
const chapterDirectory = path.join(
  process.cwd(),
  "data",
  "repertory",
  "published",
  version,
  "sources",
  sourceId,
  "chapters"
);
const outputPath = path.join(process.cwd(), "public", "data", "clarkeClinicalRepertoryData.json");

const inputFiles = fs.readdirSync(chapterDirectory)
  .filter((name) => name.endsWith(".json"))
  .sort();

const rubrics = inputFiles.flatMap((name) => {
  const input = JSON.parse(fs.readFileSync(path.join(chapterDirectory, name), "utf8")) as PublishedClarkeRubric[];
  return input.map((rubric) => ({
    id: String(rubric.rubricId || rubric.id || ""),
    chapter: rubric.chapterId || rubric.hierarchyPath?.[0] || "Clinical Index",
    name: String(rubric.displayText || rubric.title || rubric.rubricId || rubric.id || ""),
    remedies: {},
    source: "clarke",
    scoringEnabled: false,
    citation: rubric.sourceCitation || "John Henry Clarke, A Clinical Repertory (1904)",
  }));
}).sort((left, right) =>
  left.chapter.localeCompare(right.chapter) ||
  left.name.localeCompare(right.name) ||
  String(left.id).localeCompare(String(right.id))
);

if (rubrics.length !== 7_222) {
  throw new Error(`Expected 7,222 Clarke rubrics, received ${rubrics.length}.`);
}
if (rubrics.some((rubric) => !rubric.id || !rubric.name || Object.keys(rubric.remedies).length > 0 || rubric.scoringEnabled)) {
  throw new Error("Clarke browser projection violated its search-only contract.");
}

fs.writeFileSync(outputPath, JSON.stringify(rubrics));
console.log(`Wrote ${rubrics.length} search-only Clarke rubrics to ${outputPath}.`);
