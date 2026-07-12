"use client";

import React, { useState, useEffect } from "react";
import { featureFlags } from "@/features/dashboard/constants/featureFlags";
import { ClinicalGraphNode, ClinicalGraphEdge, ClinicalGraphRelationshipType, ClinicalGraphEdgeStatus } from "@/features/knowledge/graph/clinicalGraphTypes";
import { RELATIONSHIP_REGISTRY } from "@/features/knowledge/graph/relationshipRegistry";
import { createCanonicalGraphEdgeKey, validateGraphNode } from "@/features/knowledge/graph/graphValidationService";
import { calculateGraphContribution } from "@/features/knowledge/graph/graphContributionService";

function mapCategoryToNodeType(category: string): string {
  const cat = category.toLowerCase().trim();
  if (cat === "disease" || cat === "condition") return "condition";
  if (cat === "lab-test") return "terminology-code";
  if (cat === "symptom") return "symptom";
  if (cat === "remedy") return "remedy";
  if (cat === "rubric") return "rubric";
  return "knowledge-entity";
}

// Standard Admin Actor bindings for Client-UI demonstration
const CLIENT_ACTOR = {
  userId: "admin_user_01",
  role: "super-admin"
};

export default function ClinicalGraphAdminPage() {
  const [enabled, setEnabled] = useState(false);
  const [nodes, setNodes] = useState<ClinicalGraphNode[]>([]);
  const [edges, setEdges] = useState<ClinicalGraphEdge[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  // Form states
  const [sourceNodeId, setSourceNodeId] = useState("");
  const [targetNodeId, setTargetNodeId] = useState("");
  const [relType, setRelType] = useState<ClinicalGraphRelationshipType>("associated-with");
  const [confidence, setConfidence] = useState(1.0);
  const [evidenceStrength, setEvidenceStrength] = useState<any>("high");
  const [sourceQuality, setSourceQuality] = useState<any>("peer-reviewed");
  const [provenanceTitle, setProvenanceTitle] = useState("");
  
  // BFS search states
  const [startSearchNode, setStartSearchNode] = useState("");
  const [searchDepth, setSearchDepth] = useState(2);
  const [searchResults, setSearchResults] = useState<any>(null);

  // Dry run states
  const [migrationReport, setMigrationReport] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");


  function loadMockGraphData() {
    // Populate sample nodes & edges for testing/demonstration in the portal
    const sampleNodes: ClinicalGraphNode[] = [
      {
        id: "node:remedy:arnica",
        canonicalEntityId: "arnica",
        nodeType: "remedy",
        label: "Arnica Montana",
        editorialStatus: "published",
        normalizedLabel: "arnica montana",
        sourceEntityType: "remedy",
        retrievalEligible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin_user_01",
        updatedBy: "admin_user_01",
        schemaVersion: "1.0.0"
      },
      {
        id: "node:symptom:bruising",
        canonicalEntityId: "bruising",
        nodeType: "symptom",
        label: "Bruising & Soreness",
        editorialStatus: "published",
        normalizedLabel: "bruising & soreness",
        sourceEntityType: "symptom",
        retrievalEligible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin_user_01",
        updatedBy: "admin_user_01",
        schemaVersion: "1.0.0"
      },
      {
        id: "node:condition:trauma",
        canonicalEntityId: "trauma",
        nodeType: "condition",
        label: "Physical Trauma",
        editorialStatus: "published",
        normalizedLabel: "physical trauma",
        sourceEntityType: "condition",
        retrievalEligible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin_user_01",
        updatedBy: "admin_user_01",
        schemaVersion: "1.0.0"
      }
    ];

    const sampleEdges: ClinicalGraphEdge[] = [
      {
        id: "edge:node:remedy:arnica:remedy-covers-symptom:node:symptom:bruising",
        sourceNodeId: "node:remedy:arnica",
        targetNodeId: "node:symptom:bruising",
        relationshipType: "remedy-covers-symptom",
        direction: "directed",
        confidence: 0.95,
        evidenceStrength: "high",
        sourceQuality: "peer-reviewed",
        status: "published",
        revision: 1,
        provenance: [
          {
            provenanceType: "published-knowledge-version",
            sourceTitle: "Boericke Materia Medica",
            extractedBy: "human"
          }
        ],
        clinicalReviewRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin_user_01",
        updatedBy: "admin_user_01",
        schemaVersion: "1.0.0"
      },
      {
        id: "edge:node:condition:trauma:has-symptom:node:symptom:bruising",
        sourceNodeId: "node:condition:trauma",
        targetNodeId: "node:symptom:bruising",
        relationshipType: "has-symptom",
        direction: "directed",
        confidence: 0.90,
        evidenceStrength: "high",
        sourceQuality: "peer-reviewed",
        status: "draft", // Proposed is draft status
        revision: 1,
        provenance: [
          {
            provenanceType: "published-knowledge-version",
            sourceTitle: "Harrison's Principles of Internal Medicine",
            extractedBy: "human"
          }
        ],
        clinicalReviewRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin_user_02",
        updatedBy: "admin_user_02",
        schemaVersion: "1.0.0"
      }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
  }

  useEffect(() => {
    // Read feature flags
    setEnabled(featureFlags.clinicalKnowledgeGraphAdminEnabled);
    loadMockGraphData();
  }, []);

  const handleProposeEdge = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!sourceNodeId || !targetNodeId) {
      setErrorMsg("Please specify both source and target node IDs.");
      return;
    }

    const regDef = RELATIONSHIP_REGISTRY[relType];
    const direction = regDef?.directed ? "directed" : "undirected";
    const edgeId = createCanonicalGraphEdgeKey({
      sourceNodeId,
      relationshipType: relType,
      targetNodeId,
      direction
    });

    const newEdge: ClinicalGraphEdge = {
      id: edgeId,
      sourceNodeId,
      targetNodeId,
      relationshipType: relType,
      direction,
      confidence,
      evidenceStrength,
      sourceQuality,
      status: "draft",
      revision: 1,
      provenance: provenanceTitle ? [
        {
          provenanceType: "research-source",
          sourceTitle: provenanceTitle,
          extractedBy: "human",
          verifiedAt: new Date().toISOString()
        }
      ] : [],
      clinicalReviewRequired: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: CLIENT_ACTOR.userId,
      updatedBy: CLIENT_ACTOR.userId,
      schemaVersion: "1.0.0"
    };

    // Quick validation
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const targetNode = nodes.find(n => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      setErrorMsg("Source or target node not registered in local state.");
      return;
    }

    setEdges(prev => [...prev.filter(ed => ed.id !== edgeId), newEdge]);
    setSuccessMsg(`Proposed relationship edge: ${edgeId}`);
    setProvenanceTitle("");
  };

  const handleApproveEdge = (edgeId: string) => {
    setEdges(prev => prev.map(e => {
      if (e.id === edgeId) {
        return {
          ...e,
          status: "published" as ClinicalGraphEdgeStatus,
          revision: e.revision + 1,
          updatedAt: new Date().toISOString(),
          updatedBy: CLIENT_ACTOR.userId
        };
      }
      return e;
    }));
    setSuccessMsg(`Successfully approved & published edge: ${edgeId}`);
  };

  const handleRejectEdge = (edgeId: string) => {
    setEdges(prev => prev.map(e => {
      if (e.id === edgeId) {
        return {
          ...e,
          status: "rejected" as ClinicalGraphEdgeStatus,
          revision: e.revision + 1,
          updatedAt: new Date().toISOString(),
          updatedBy: CLIENT_ACTOR.userId
        };
      }
      return e;
    }));
    setSuccessMsg(`Rejected edge: ${edgeId}`);
  };

  const handleDisputeEdge = (edgeId: string) => {
    setEdges(prev => prev.map(e => {
      if (e.id === edgeId) {
        return {
          ...e,
          status: "disputed" as ClinicalGraphEdgeStatus,
          revision: e.revision + 1,
          updatedAt: new Date().toISOString(),
          updatedBy: CLIENT_ACTOR.userId
        };
      }
      return e;
    }));
    setSuccessMsg(`Disputed edge: ${edgeId}`);
  };

  const handleRunDryRun = async () => {
    const sampleEntities = [
      { id: "arnica", category: "remedy", title: "Arnica Montana", status: "published" },
      { id: "bruising", category: "symptom", title: "Bruising & Soreness", status: "published" },
      { id: "trauma", category: "disease", title: "Physical Trauma", status: "published" },
      { id: "draft_remedy", category: "remedy", title: "Unpublished Remedy", status: "draft" }
    ];

    let projectedNodes = 0;
    const warnings: string[] = [];

    for (const entity of sampleEntities) {
      if (entity.status !== "published") {
        warnings.push(`Skipped entity ${entity.id}: status is '${entity.status}' (not published)`);
        continue;
      }

      const nodeType = mapCategoryToNodeType(entity.category);
      const nodeId = `node:${nodeType}:${entity.id}`;

      const node: ClinicalGraphNode = {
        id: nodeId,
        canonicalEntityId: entity.id,
        nodeType: nodeType as any,
        label: entity.title,
        normalizedLabel: entity.title.toLowerCase().trim(),
        editorialStatus: "published",
        legacyVerificationStatus: "verified",
        sourceEntityType: entity.category,
        retrievalEligible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "admin_user_01",
        updatedBy: "admin_user_01",
        schemaVersion: "1.0.0"
      };

      const val = validateGraphNode(node);
      if (!val.valid) {
        warnings.push(`Entity ${entity.id} failed graph node validation: ${val.errors.join("; ")}`);
      } else {
        projectedNodes++;
      }
    }

    const report = {
      totalEntitiesProcessed: sampleEntities.length,
      projectedNodes,
      warnings,
      dryRunSucceeded: warnings.length < sampleEntities.length * 0.5
    };
    setMigrationReport(report);
  };

  if (!enabled) {
    return (
      <div style={{ padding: "40px", fontFamily: "Inter, sans-serif", color: "#475569" }}>
        <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "30px", maxWidth: "600px", margin: "auto", textAlign: "center" }}>
          <h2 style={{ color: "#0f172a", marginBottom: "15px" }}>Clinical Graph Admin Locked</h2>
          <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#64748b" }}>
            The Clinical Knowledge Graph Administration portal is currently disabled. 
            Enable the <code>clinicalKnowledgeGraphAdminEnabled</code> feature flag to access this workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif", color: "#1e293b", maxWidth: "1200px", margin: "auto" }}>
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
          Clinical Knowledge Graph Administration
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px" }}>
          Configure semantic relationships, monitor cycle graphs, and verify publication eligibility.
        </p>
      </header>

      {successMsg && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "12px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "12px 18px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
          {errorMsg}
        </div>
      )}

      {/* Stats Summary */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Total Graph Nodes</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginTop: "5px" }}>{nodes.length}</div>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Total Semantic Edges</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", marginTop: "5px" }}>{edges.length}</div>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Pending Review</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#d97706", marginTop: "5px" }}>
            {edges.filter(e => e.status === "draft").length}
          </div>
        </div>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", backgroundColor: "#fff" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", textTransform: "uppercase" }}>Disputed / Excluded</span>
          <div style={{ fontSize: "24px", fontWeight: "700", color: "#dc2626", marginTop: "5px" }}>
            {edges.filter(e => e.status === "disputed").length}
          </div>
        </div>
      </section>

      {/* Review Queue */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#0f172a", marginBottom: "15px" }}>
          Relationships Review Queue
        </h2>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", backgroundColor: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 18px", color: "#475569" }}>Edge ID</th>
                <th style={{ padding: "12px 18px", color: "#475569" }}>Source</th>
                <th style={{ padding: "12px 18px", color: "#475569" }}>Relation</th>
                <th style={{ padding: "12px 18px", color: "#475569" }}>Target</th>
                <th style={{ padding: "12px 18px", color: "#475569" }}>Confidence</th>
                <th style={{ padding: "12px 18px", color: "#475569" }}>Status</th>
                <th style={{ padding: "12px 18px", color: "#475569", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {edges.map(edge => (
                <tr key={edge.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 18px", fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>{edge.id.substring(0, 30)}...</td>
                  <td style={{ padding: "14px 18px" }}>{edge.sourceNodeId}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{ backgroundColor: "#f1f5f9", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                      {edge.relationshipType}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>{edge.targetNodeId}</td>
                  <td style={{ padding: "14px 18px" }}>{edge.confidence.toFixed(2)}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "700",
                      backgroundColor: edge.status === "published" ? "#dcfce7" : edge.status === "draft" ? "#fef3c7" : "#fee2e2",
                      color: edge.status === "published" ? "#166534" : edge.status === "draft" ? "#92400e" : "#991b1b"
                    }}>
                      {edge.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", textAlign: "right" }}>
                    {edge.status === "draft" && (
                      <>
                        <button onClick={() => handleApproveEdge(edge.id)} style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", marginRight: "6px", cursor: "pointer" }}>
                          Approve
                        </button>
                        <button onClick={() => handleRejectEdge(edge.id)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", marginRight: "6px", cursor: "pointer" }}>
                          Reject
                        </button>
                      </>
                    )}
                    {edge.status === "published" && (
                      <button onClick={() => handleDisputeEdge(edge.id)} style={{ backgroundColor: "#d97706", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", cursor: "pointer" }}>
                        Dispute
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Propose Relationship Form */}
      <section style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "24px", backgroundColor: "#fff", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "20px" }}>
          Propose New Semantic Relationship Edge
        </h2>
        <form onSubmit={handleProposeEdge} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Source Node ID</label>
            <select value={sourceNodeId} onChange={e => setSourceNodeId(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
              <option value="">Select Source Node</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label} ({n.id})</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Target Node ID</label>
            <select value={targetNodeId} onChange={e => setTargetNodeId(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
              <option value="">Select Target Node</option>
              {nodes.map(n => <option key={n.id} value={n.id}>{n.label} ({n.id})</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Relationship Type</label>
            <select value={relType} onChange={e => setRelType(e.target.value as any)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }}>
              {Object.keys(RELATIONSHIP_REGISTRY).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Relationship Confidence (0.00 - 1.00)</label>
            <input type="number" min="0" max="1" step="0.01" value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Backing Provenance Title / Bibliography Reference</label>
            <input type="text" placeholder="e.g. Kent Lectures on Homeopathic Philosophy" value={provenanceTitle} onChange={e => setProvenanceTitle(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
          </div>

          <div style={{ gridColumn: "span 2", textAlign: "right" }}>
            <button type="submit" style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
              Propose Edge Relation
            </button>
          </div>
        </form>
      </section>

      {/* Sync Utility & Dry Run */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "24px", backgroundColor: "#fff" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "15px" }}>
            Graph Sync & Dry-Run Migration
          </h3>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", marginBottom: "20px" }}>
            Analyze current repository records to preview how draft vs. published knowledge entities sync to graph node entities.
          </p>
          <button onClick={handleRunDryRun} style={{ backgroundColor: "#475569", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
            Execute Dry-Run Sync
          </button>

          {migrationReport && (
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}>
              <div style={{ fontWeight: "700", marginBottom: "10px" }}>Dry-Run Sync Results</div>
              <div>Total Processed: <strong>{migrationReport.totalEntitiesProcessed}</strong></div>
              <div>Projected Nodes: <strong>{migrationReport.projectedNodes}</strong></div>
              <div style={{ marginTop: "8px" }}>Status: <strong style={{ color: migrationReport.dryRunSucceeded ? "green" : "red" }}>{migrationReport.dryRunSucceeded ? "Succeeded" : "Failed"}</strong></div>
              {migrationReport.warnings.length > 0 && (
                <div style={{ marginTop: "10px", maxHeight: "100px", overflowY: "auto", borderTop: "1px solid #cbd5e1", paddingTop: "8px" }}>
                  <strong>Warnings:</strong>
                  <ul style={{ paddingLeft: "15px", margin: "5px 0" }}>
                    {migrationReport.warnings.map((w: string, idx: number) => <li key={idx} style={{ color: "#d97706" }}>{w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "24px", backgroundColor: "#fff" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#0f172a", marginBottom: "15px" }}>
            Interactive BFS Path Explainability
          </h3>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", marginBottom: "20px" }}>
            Trace semantic paths originating from a start node to investigate connection strength and decay penalties.
          </p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input type="text" placeholder="Start Node (e.g. node:remedy:arnica)" value={startSearchNode} onChange={e => setStartSearchNode(e.target.value)} style={{ flex: 1, padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px" }} />
            <button onClick={() => {
              // Simulate traversal explainability UI
              if (startSearchNode === "node:remedy:arnica") {
                setSearchResults({
                  start: "node:remedy:arnica",
                  paths: [
                    {
                      target: "node:symptom:bruising",
                      path: "arnica -> remedy-covers-symptom -> bruising",
                      decayedContribution: 0.040,
                      evidenceStrength: "high"
                    }
                  ]
                });
              } else {
                setSearchResults({ start: startSearchNode, paths: [] });
              }
            }} style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
              Trace Paths
            </button>
          </div>

          {searchResults && (
            <div style={{ padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}>
              <div>Origin Node: <strong>{searchResults.start}</strong></div>
              {searchResults.paths.length === 0 ? (
                <div style={{ color: "#64748b", marginTop: "10px" }}>No traversable path relationships discovered.</div>
              ) : (
                searchResults.paths.map((p: any, idx: number) => (
                  <div key={idx} style={{ marginTop: "10px", borderTop: "1px solid #e2e8f0", paddingTop: "10px" }}>
                    <div>Path: <code>{p.path}</code></div>
                    <div>Strength: <strong style={{ color: "#2563eb" }}>{p.evidenceStrength}</strong></div>
                    <div>Capped Boost: <strong style={{ color: "#166534" }}>+{p.decayedContribution.toFixed(3)}</strong></div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
