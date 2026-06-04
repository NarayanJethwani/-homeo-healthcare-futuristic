import { 
  getKnowledgeGraph, 
  GraphNode, 
  GraphEdge, 
  NodeType 
} from "./knowledgeGraph";
import { resolveCanonicalRemedyId } from "./normalizationEngine";

export interface SearchPathStep {
  sourceLabel: string;
  sourceType: NodeType;
  edgeType: string;
  targetLabel: string;
  targetType: NodeType;
}

export interface SearchResult {
  remedyId: string;
  remedyLabel: string;
  score: number; // Relevance score
  matchingEntities: { node: GraphNode; reason: string }[];
  paths: SearchPathStep[];
}

export interface ParseQueryResponse {
  interpretedQuery: string;
  matchedEntities: GraphNode[];
  results: SearchResult[];
}

export const parseNaturalLanguageQuery = (queryText: string): ParseQueryResponse => {
  const normalizedText = queryText.toLowerCase().trim();
  const graph = getKnowledgeGraph();
  const matchedEntities: GraphNode[] = [];
  const reasons: Record<string, string> = {};

  // Helper to add entity
  const addEntity = (nodeId: string, reason: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    if (node && !matchedEntities.some(e => e.id === nodeId)) {
      matchedEntities.push(node);
      reasons[nodeId] = reason;
    }
  };

  // --- ENTITY PARSING RULES ---
  
  // 1. Kingdoms
  if (normalizedText.includes('plant') || normalizedText.includes('botanical') || normalizedText.includes('herb')) {
    addEntity('king_plant', 'Matched Kingdom: Plant');
  }
  if (normalizedText.includes('mineral') || normalizedText.includes('chemical') || normalizedText.includes('metal')) {
    addEntity('king_mineral', 'Matched Kingdom: Mineral');
  }
  if (normalizedText.includes('animal') || normalizedText.includes('snake') || normalizedText.includes('insect')) {
    addEntity('king_animal', 'Matched Kingdom: Animal');
  }

  // 2. Miasms
  if (normalizedText.includes('psora') || normalizedText.includes('psoric')) {
    addEntity('mias_psora', 'Matched Miasm: Psora');
  }
  if (normalizedText.includes('sycosis') || normalizedText.includes('sycotic')) {
    addEntity('mias_sycosis', 'Matched Miasm: Sycosis');
  }
  if (normalizedText.includes('syphilis') || normalizedText.includes('syphilitic')) {
    addEntity('mias_syphilis', 'Matched Miasm: Syphilis');
  }
  if (normalizedText.includes('tubercular') || normalizedText.includes('consumption')) {
    addEntity('mias_tubercular', 'Matched Miasm: Tubercular');
  }

  // 3. Modalities
  if (normalizedText.includes('warmth of bed') || normalizedText.includes('warm bed') || normalizedText.includes('warmth in bed')) {
    addEntity('mod_warmth_bed_agg', 'Matched Modality: Worse warmth of bed');
  }
  if (normalizedText.includes('standing') || normalizedText.includes('worse standing')) {
    addEntity('mod_standing_agg', 'Matched Modality: Worse standing');
  }
  if (normalizedText.includes('open air') || normalizedText.includes('cool open air') || normalizedText.includes('better open air')) {
    addEntity('mod_open_air_amel', 'Matched Modality: Better open air');
  }
  if (normalizedText.includes('4 pm') || normalizedText.includes('4-8 pm') || normalizedText.includes('afternoon')) {
    addEntity('mod_4_8_pm_agg', 'Matched Modality: Worse 4 PM - 8 PM');
  }
  if (normalizedText.includes('warm drinks') || normalizedText.includes('warm water') || normalizedText.includes('hot water')) {
    addEntity('mod_warm_drinks_amel', 'Matched Modality: Better warm drinks');
  }
  if (normalizedText.includes('3 am') || normalizedText.includes('worse 3 am')) {
    addEntity('mod_3_am_agg', 'Matched Modality: Worse 3 AM');
  }
  if (normalizedText.includes('midnight') || normalizedText.includes('12 am') || normalizedText.includes('2 am')) {
    addEntity('mod_midnight_agg', 'Matched Modality: Worse midnight to 2 AM');
  }
  if (normalizedText.includes('cold draft') || normalizedText.includes('cold wind') || normalizedText.includes('drafts')) {
    addEntity('mod_cold_draft_agg', 'Matched Modality: Worse cold drafts');
  }
  if (normalizedText.includes('motion') || normalizedText.includes('slightest motion') || normalizedText.includes('movement')) {
    addEntity('mod_motion_agg', 'Matched Modality: Worse slightest motion');
  }
  if (normalizedText.includes('pressure') || normalizedText.includes('hard pressure') || normalizedText.includes('better pressure')) {
    addEntity('mod_pressure_amel', 'Matched Modality: Better hard pressure');
  }
  if (normalizedText.includes('chilly') || normalizedText.includes('chilliness') || normalizedText.includes('coldness')) {
    // Treat chilliness as matching the cold draft aggravation modality
    addEntity('mod_cold_draft_agg', 'Matched Modality: Worse cold drafts (Chilliness)');
  }

  // 4. Rubrics
  if (normalizedText.includes('health anxiety') || normalizedText.includes('anxiety about health') || (normalizedText.includes('anxiety') && normalizedText.includes('health'))) {
    addEntity('rub_health_anxiety', 'Matched Rubric: Anxiety about health');
  }
  if (normalizedText.includes('anticipatory anxiety') || normalizedText.includes('stage fright') || normalizedText.includes('anticipation')) {
    addEntity('rub_anticipatory_anxiety', 'Matched Rubric: Anticipatory anxiety / Stage fright');
  }
  if (normalizedText.includes('irritable when questioned') || normalizedText.includes('questioned') || normalizedText.includes('interrupted')) {
    addEntity('rub_irritable_questioned', 'Matched Rubric: Irritability when questioned');
  }
  if (normalizedText.includes('fastidious') || normalizedText.includes('orderliness') || normalizedText.includes('neatness')) {
    addEntity('rub_fastidious', 'Matched Rubric: Fastidious');
  }
  if (normalizedText.includes('burning feet') || normalizedText.includes('burning soles') || (normalizedText.includes('feet') && normalizedText.includes('burning'))) {
    addEntity('rub_burning_feet_bed', 'Matched Rubric: Burning feet in bed');
  }
  if (normalizedText.includes('empty at 11 am') || normalizedText.includes('11 am') || normalizedText.includes('empty stomach')) {
    addEntity('rub_empty_11am', 'Matched Rubric: Stomach emptiness at 11 AM');
  }
  if (normalizedText.includes('bloating') || normalizedText.includes('distension') || normalizedText.includes('flatulence')) {
    addEntity('rub_bloating_after_eating', 'Matched Rubric: Bloating after eating');
  }
  if (normalizedText.includes('right-sided headache') || normalizedText.includes('right sided headache') || (normalizedText.includes('headache') && normalizedText.includes('right'))) {
    addEntity('rub_right_sided_headache', 'Matched Rubric: Right-sided headache');
  }
  if (normalizedText.includes('fear of death') || normalizedText.includes('fear death')) {
    addEntity('rub_fear_death', 'Matched Rubric: Fear of death');
  }
  if (normalizedText.includes('fear of poverty') || normalizedText.includes('poverty') || normalizedText.includes('financial')) {
    addEntity('rub_fear_poverty', 'Matched Rubric: Fear of poverty');
  }
  if (normalizedText.includes('apprehensive') || normalizedText.includes('fears')) {
    addEntity('rub_apprehensive_fears', 'Matched Rubric: Apprehensive / Fears');
  }
  if (normalizedText.includes('grief') || normalizedText.includes('suppressed emotions')) {
    addEntity('rub_grief_suppressed', 'Matched Rubric: Suppressed grief');
  }
  if (normalizedText.includes('restlessness') || normalizedText.includes('restless')) {
    addEntity('rub_restlessness_anxious', 'Matched Rubric: Anxious restlessness');
  }

  // 5. Direct Remedies (by name or abbreviation using normalization engine)
  const resolvedDirect = resolveCanonicalRemedyId(normalizedText);
  if (resolvedDirect && resolvedDirect.startsWith("rem_")) {
    const node = graph.nodes.find(n => n.id === resolvedDirect);
    if (node) {
      addEntity(resolvedDirect, `Direct Match: ${node.label}`);
    }
  }

  // Also check individual words for remedy matches
  const queryWords = normalizedText.split(/[\s,\.\-_]+/);
  queryWords.forEach(word => {
    if (word.length >= 3) {
      const resolvedWord = resolveCanonicalRemedyId(word);
      if (resolvedWord && resolvedWord.startsWith("rem_")) {
        const node = graph.nodes.find(n => n.id === resolvedWord);
        if (node) {
          addEntity(resolvedWord, `Direct Match: ${node.label}`);
        }
      }
    }
  });

  // --- PATH-TRACING ENGINE ---
  const results: SearchResult[] = [];
  const remedies = graph.nodes.filter(n => n.type === 'remedy');

  remedies.forEach(remedy => {
    let matchCount = 0;
    const matchingEntities: { node: GraphNode; reason: string }[] = [];
    const paths: SearchPathStep[] = [];

    matchedEntities.forEach(entity => {
      // Find edge connecting this remedy to the target entity
      const directEdge = graph.edges.find(e => 
        (e.source === remedy.id && e.target === entity.id) ||
        (e.source === entity.id && e.target === remedy.id)
      );

      if (directEdge) {
        matchCount++;
        matchingEntities.push({ node: entity, reason: reasons[entity.id] });
        
        const isSourceRemedy = directEdge.source === remedy.id;
        const sourceNode = graph.nodes.find(n => n.id === directEdge.source)!;
        const targetNode = graph.nodes.find(n => n.id === directEdge.target)!;
        
        paths.push({
          sourceLabel: sourceNode.label,
          sourceType: sourceNode.type,
          edgeType: directEdge.type,
          targetLabel: targetNode.label,
          targetType: targetNode.type
        });
      } else {
        // Look for 2-hop connections (e.g. Remedy -> treats_condition -> Condition -> has_symptom -> Rubric)
        // Check if there is an edge: Remedy -> treats_condition -> Condition, and Condition -> has_symptom -> Rubric
        const firstHops = graph.edges.filter(e => e.source === remedy.id || e.target === remedy.id);
        
        let pathFound = false;
        for (const edge1 of firstHops) {
          const neighborId = edge1.source === remedy.id ? edge1.target : edge1.source;
          const secondHops = graph.edges.filter(e => e.source === neighborId || e.target === neighborId);
          
          const edge2 = secondHops.find(e => e.source === entity.id || e.target === entity.id);
          if (edge2) {
            matchCount += 0.7; // 2-hop match has lower weight
            matchingEntities.push({ node: entity, reason: `${reasons[entity.id]} (via ${graph.nodes.find(n => n.id === neighborId)?.label})` });
            
            const nodeR = remedy;
            const nodeN = graph.nodes.find(n => n.id === neighborId)!;
            const nodeE = entity;

            paths.push({
              sourceLabel: nodeR.label,
              sourceType: nodeR.type,
              edgeType: edge1.type,
              targetLabel: nodeN.label,
              targetType: nodeN.type
            });
            paths.push({
              sourceLabel: nodeN.label,
              sourceType: nodeN.type,
              edgeType: edge2.type,
              targetLabel: nodeE.label,
              targetType: nodeE.type
            });
            pathFound = true;
            break;
          }
        }
      }
    });

    if (matchCount > 0) {
      // Calculate score: matchCount divided by total queries * 100
      const score = Math.min(Math.round((matchCount / Math.max(matchedEntities.length, 1)) * 100), 100);
      
      // We only include it if it matches at least one condition or we had no query terms matched
      if (score > 10 || matchedEntities.length === 0) {
        results.push({
          remedyId: remedy.id,
          remedyLabel: remedy.label,
          score,
          matchingEntities,
          paths
        });
      }
    }
  });

  // Sort results by score descending
  results.sort((a, b) => b.score - a.score);

  // Construct interpreted query
  let interpretedQuery = "Searching Knowledge Graph for nodes: ";
  if (matchedEntities.length > 0) {
    interpretedQuery += matchedEntities.map(e => `[${e.label} (${e.type})]`).join(" AND ");
  } else {
    interpretedQuery += "No specific graph nodes matched. Showing remedies with high connectivity.";
    // Fallback: return top remedies by number of edges
    remedies.forEach(rem => {
      const edgeCount = graph.edges.filter(e => e.source === rem.id || e.target === rem.id).length;
      results.push({
        remedyId: rem.id,
        remedyLabel: rem.label,
        score: Math.min(edgeCount * 5, 95),
        matchingEntities: [],
        paths: []
      });
    });
    results.sort((a, b) => b.score - a.score);
  }

  return {
    interpretedQuery,
    matchedEntities,
    results: results.slice(0, 5) // return top 5 matches
  };
};
