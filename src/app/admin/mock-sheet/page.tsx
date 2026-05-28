"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { FileSpreadsheet, ArrowLeft, Info, AlertTriangle, Check, Edit3, Grid, HelpCircle } from "lucide-react";
import Link from "next/link";

function MockSheetContent() {
  const searchParams = useSearchParams();

  // Extract query parameters
  const name = searchParams.get("name") || "Aarav Mehta";
  const id = searchParams.get("id") || "P-100234";
  const age = searchParams.get("age") || "42";
  const gender = searchParams.get("gender") || "Male";
  const phone = searchParams.get("phone") || "+91 98200 12345";
  const email = searchParams.get("email") || "aarav.mehta@gmail.com";
  const complaint = searchParams.get("complaint") || "Chronic severe acidity, GERD, and abdominal bloating immediately after eating. Irritability, very chilly, worse cold drinks.";
  const careLevel = searchParams.get("careLevel") || "Advanced Chronic Tier";
  const durationText = searchParams.get("durationText") || "6-Month Treatment Plan";
  const finalPriceVal = searchParams.get("finalPrice") || "8500";
  const finalPrice = Number(finalPriceVal).toLocaleString("en-IN");

  const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

  // Columns: A, B, C, D
  // Rows: 1 to 40
  const rowCount = 40;
  const colCount = 4;
  
  // We represent the 2D grid
  const [grid, setGrid] = useState<string[][]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    // Initialize sheet grid values based on patient details
    const initialGrid = Array(rowCount).fill(null).map(() => Array(colCount).fill(""));

    // Title banner
    initialGrid[0][0] = "RAMKRISHNA HOMEO HEALTHCARE - CLINICAL CASE SHEET";
    
    // Demographics header
    initialGrid[2][0] = "1. PATIENT DEMOGRAPHICS";
    
    // Row 4 (1-based row index in spreadsheet terms)
    initialGrid[3][0] = "Patient ID";
    initialGrid[3][1] = id;
    initialGrid[3][2] = "Register Date";
    initialGrid[3][3] = today;

    // Row 5
    initialGrid[4][0] = "Patient Name";
    initialGrid[4][1] = name;
    initialGrid[4][2] = "Age / Gender";
    initialGrid[4][3] = `${age} / ${gender}`;

    // Row 6
    initialGrid[5][0] = "Contact Phone";
    initialGrid[5][1] = phone;
    initialGrid[5][2] = "Email Address";
    initialGrid[5][3] = email;

    // Row 7
    initialGrid[6][0] = "Delivery Option";
    initialGrid[6][1] = "Courier Shipping";
    initialGrid[6][2] = "Location / Address";
    initialGrid[6][3] = "Pune, Maharashtra, India";

    // Row 8
    initialGrid[7][0] = "Recommended Tier";
    initialGrid[7][1] = careLevel;
    initialGrid[7][2] = "Billing Duration";
    initialGrid[7][3] = durationText;

    // Row 9
    initialGrid[8][0] = "Payment Status";
    initialGrid[8][1] = "Paid (Verified)";
    initialGrid[8][2] = "Payment Amount";
    initialGrid[8][3] = `INR ${finalPrice}`;

    // Section 2 Header
    initialGrid[10][0] = "2. CHIEF COMPLAINT & CASE ANALYSIS";
    initialGrid[11][0] = "Chief Complaint Details";
    initialGrid[11][1] = complaint; // Merged across B12:D15

    // Section 3 Header
    initialGrid[15][0] = "3. CLINICAL REPERTORIZATION & RUBRICS";
    initialGrid[16][0] = "Rubric Name";
    initialGrid[16][1] = "Chapter / Location";
    initialGrid[16][2] = "Remedy Grade (1/2/3)";
    initialGrid[16][3] = "Clinical Notes & Key Modalities";

    // Standard rubrics suggestions
    initialGrid[17][0] = "Stomach - Acidity - eating, after";
    initialGrid[17][1] = "Stomach";
    initialGrid[17][2] = "3";
    initialGrid[17][3] = "Violent burning, worse post-meals";

    initialGrid[18][0] = "Mind - Irritability";
    initialGrid[18][1] = "Mind";
    initialGrid[18][2] = "2";
    initialGrid[18][3] = "Anxious restlessness";

    initialGrid[19][0] = "Generalities - Chilly";
    initialGrid[19][1] = "Generalities";
    initialGrid[19][2] = "3";
    initialGrid[19][3] = "Extreme sensitivity to drafts";

    // Section 4 Header
    initialGrid[23][0] = "4. PRESCRIPTION & TREATMENT PLAN";
    initialGrid[24][0] = "Remedy Prescribed";
    initialGrid[24][1] = "Potency & Scale";
    initialGrid[24][2] = "Dosage & Frequency";
    initialGrid[24][3] = "Duration & Schedule";

    initialGrid[25][0] = "Nux Vomica";
    initialGrid[25][1] = "30C";
    initialGrid[25][2] = "4 pills, twice daily";
    initialGrid[25][3] = "14 Days (Bedtime/Morning)";

    initialGrid[26][0] = "Arsenicum Album";
    initialGrid[26][1] = "200C";
    initialGrid[26][2] = "4 pills, single dose";
    initialGrid[26][3] = "SOS (For acute gastric distress)";

    // Section 5 Header
    initialGrid[31][0] = "5. CLINICAL PROGRESS & FOLLOW-UPS";
    initialGrid[32][0] = "Date";
    initialGrid[32][1] = "Symptom Status & Patient Report";
    initialGrid[32][2] = "Prescription Adjustments";
    initialGrid[32][3] = "Next Review Date";

    initialGrid[33][0] = today;
    initialGrid[33][1] = "Case initialized. Symptoms documented.";
    initialGrid[33][2] = "Nux Vomica 30C + Ars Alb 200C prescribed.";
    initialGrid[33][3] = "After 2 weeks";

    setGrid(initialGrid);
  }, [name, id, age, gender, phone, email, complaint, careLevel, durationText, finalPrice, today]);

  const handleCellClick = (r: number, c: number) => {
    // Don't allow editing main section banners
    if (r === 0 || r === 2 || r === 10 || r === 15 || r === 23 || r === 31) return;
    
    // Don't allow editing headers of tables
    if (r === 16 || r === 24 || r === 32) return;

    setEditingCell({ row: r, col: c });
    setEditValue(grid[r]?.[c] || "");
  };

  const handleSaveCell = () => {
    if (editingCell) {
      const newGrid = [...grid];
      newGrid[editingCell.row][editingCell.col] = editValue;
      setGrid(newGrid);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveCell();
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  // Helper to check if a row is a section header banner
  const isSectionHeader = (r: number) => {
    return r === 2 || r === 10 || r === 15 || r === 23 || r === 31;
  };

  // Helper to check if a row is a table header
  const isTableHeader = (r: number) => {
    return r === 16 || r === 24 || r === 32;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none pb-12">
      {/* Top Banner Alert (Google API Status Info) */}
      <div className="bg-amber-600 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-100 animate-pulse shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">
            <span className="font-extrabold uppercase">Google Workspace Offline Preview</span> — This is a simulated high-fidelity case sheet showing the layout & programmatic formatting generated during patient sign-up.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/25"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Admin Dashboard
          </Link>
        </div>
      </div>

      {/* Google Sheets-like Toolbar Mockup */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
              {name} - Clinical Record
              <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold uppercase">
                Spreadsheet
              </span>
            </h1>
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-semibold mt-0.5">
              <span>File</span>
              <span>Edit</span>
              <span>View</span>
              <span>Insert</span>
              <span>Format</span>
              <span>Data</span>
              <span>Tools</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved to preview
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-bold bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 max-w-sm">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Double-click any record cell below to update the clinical data inline.</span>
        </div>
      </div>

      {/* Main Spreadsheet Viewer */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md max-w-5xl w-full overflow-hidden flex flex-col">
          {/* Spreadsheet Cell Grid */}
          <div className="overflow-x-auto overflow-y-auto max-h-[75vh]" style={{ minWidth: "100%" }}>
            <table className="border-collapse table-fixed w-full" style={{ minWidth: "800px" }}>
              <thead>
                <tr className="bg-slate-100 text-center text-[10px] text-slate-400 font-bold border-b border-slate-200 h-6">
                  <th className="w-10 border-r border-slate-200"></th>
                  <th className="w-[180px] border-r border-slate-200">A</th>
                  <th className="w-[280px] border-r border-slate-200">B</th>
                  <th className="w-[180px] border-r border-slate-200">C</th>
                  <th className="w-[280px] border-slate-200">D</th>
                </tr>
              </thead>
              <tbody>
                {grid.map((rowCells, rIndex) => {
                  // A1 Header Banner spanning all columns
                  if (rIndex === 0) {
                    return (
                      <tr key={rIndex} className="h-12 border-b border-slate-200">
                        <td className="bg-slate-50 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">{rIndex + 1}</td>
                        <td
                          colSpan={4}
                          className="bg-[#0f766e] text-white text-center font-extrabold text-sm tracking-wider uppercase"
                        >
                          {rowCells[0]}
                        </td>
                      </tr>
                    );
                  }

                  // Section headers merged
                  if (isSectionHeader(rIndex)) {
                    return (
                      <tr key={rIndex} className="h-8 border-b border-slate-200">
                        <td className="bg-slate-50 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">{rIndex + 1}</td>
                        <td
                          colSpan={4}
                          className="bg-[#ccfbf1] text-[#0f766e] font-extrabold text-xs px-3 text-left uppercase tracking-wide vertical-middle"
                        >
                          {rowCells[0]}
                        </td>
                      </tr>
                    );
                  }

                  // Table Headers
                  if (isTableHeader(rIndex)) {
                    return (
                      <tr key={rIndex} className="h-8 border-b border-slate-200">
                        <td className="bg-slate-50 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">{rIndex + 1}</td>
                        {rowCells.map((val, cIndex) => (
                          <td
                            key={cIndex}
                            className="bg-slate-50 border-r border-slate-200 text-left font-extrabold text-[11px] text-slate-700 px-3 uppercase tracking-wider"
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    );
                  }

                  // Row 12 (Chief complaint label A12 and merged textbox B12:D15)
                  if (rIndex === 11) {
                    return (
                      <tr key={rIndex} className="border-b border-slate-100">
                        <td className="bg-slate-50 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold" style={{ height: "100px" }}>12</td>
                        {/* Col A Label */}
                        <td className="border-r border-slate-200 text-[11px] font-extrabold text-slate-800 bg-slate-50/30 p-2.5 vertical-top align-top">
                          {rowCells[0]}
                        </td>
                        {/* Merged Col B, C, D details box */}
                        <td
                          colSpan={3}
                          className="p-3 text-[11px] text-slate-700 font-semibold cursor-pointer align-top hover:bg-slate-50 transition-colors"
                          style={{ verticalAlign: "top", wordBreak: "break-word", whiteSpace: "normal" }}
                          onDoubleClick={() => handleCellClick(11, 1)}
                        >
                          {editingCell?.row === 11 && editingCell?.col === 1 ? (
                            <textarea
                              className="w-full h-full min-h-[80px] p-2 border border-emerald-500 rounded bg-white text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleSaveCell}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") setEditingCell(null);
                              }}
                              autoFocus
                            />
                          ) : (
                            rowCells[1]
                          )}
                        </td>
                      </tr>
                    );
                  }

                  // Hide rows 13, 14, 15 as they are visually merged into row 12 for the complaint box
                  if (rIndex === 12 || rIndex === 13 || rIndex === 14) {
                    return (
                      <tr key={rIndex} className="hidden">
                        <td></td>
                      </tr>
                    );
                  }

                  // Normal rows
                  return (
                    <tr key={rIndex} className="h-8 border-b border-slate-100 hover:bg-slate-50/40">
                      <td className="bg-slate-50 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold">{rIndex + 1}</td>
                      {rowCells.map((val, cIndex) => {
                        const isLabel = (rIndex >= 3 && rIndex <= 8) && (cIndex === 0 || cIndex === 2);
                        const isDemographicData = (rIndex >= 3 && rIndex <= 8) && (cIndex === 1 || cIndex === 3);
                        
                        return (
                          <td
                            key={cIndex}
                            onDoubleClick={() => handleCellClick(rIndex, cIndex)}
                            className={`border-r border-slate-100 text-[11px] px-3 font-semibold truncate ${
                              isLabel 
                                ? "bg-slate-50/50 text-slate-800 font-extrabold border-r border-slate-200" 
                                : isDemographicData
                                  ? "text-slate-900 font-bold"
                                  : "text-slate-600"
                            } cursor-pointer`}
                          >
                            {editingCell?.row === rIndex && editingCell?.col === cIndex ? (
                              <input
                                type="text"
                                className="w-full h-full p-1 border border-emerald-500 rounded bg-white text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveCell}
                                onKeyDown={handleKeyDown}
                                autoFocus
                              />
                            ) : (
                              val
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              <span>Grid Range: Sheet1!A1:D40</span>
            </div>
            <div className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Double-click cells to simulate real-time clinical notes entry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MockSheetPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Clinical Case Sheet...</div>}>
      <MockSheetContent />
    </Suspense>
  );
}
