"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { FileSpreadsheet, ArrowLeft, Info, AlertTriangle, Check, Grid, HelpCircle, Plus, Trash2, Calendar, IndianRupee } from "lucide-react";
import Link from "next/link";

interface FollowUp {
  date: string;
  report: string;
  prescription: string;
  nextReview: string;
  amountReceived: string;
  balance: string;
}

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
  const finalPrice = Number(finalPriceVal);

  const initialReceived = Number(searchParams.get("receivedAmount") || finalPriceVal);
  const initialBalance = Number(searchParams.get("remainingBalance") || "0");

  const today = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

  const rowCount = 65; // Fixed size to prevent shifting dependency arrays
  const colCount = 6;  // 6 columns: A, B, C, D, E, F

  // Single source of truth grid state
  const [grid, setGrid] = useState<string[][]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [activeFollowUpCount, setActiveFollowUpCount] = useState(1);

  // Recalculates amount received and remaining balances for the ledger in-place
  const recalculateLedger = (currentGrid: string[][], activeCountVal = activeFollowUpCount) => {
    if (!currentGrid || currentGrid.length === 0) return currentGrid;
    const updatedGrid = currentGrid.map(row => [...row]);

    // 1. Get package price from row 4 column F (index 3, 5)
    const packagePriceStr = updatedGrid[3][5] || "";
    const packagePrice = parseFloat(packagePriceStr.replace("INR", "").replace(/[^0-9.]/g, "")) || 0;

    // 2. Loop through all active follow-ups starting at row 39 (index 38)
    let runningBalance = packagePrice;
    let totalReceived = 0;

    const displayCount = Math.max(6, activeCountVal);
    for (let i = 0; i < displayCount; i++) {
      const r = 38 + i;
      if (r >= updatedGrid.length) break;

      const amtReceivedStr = updatedGrid[r][4] || "";
      const amtReceived = parseFloat(amtReceivedStr.replace("₹", "").replace(/[^0-9.]/g, "")) || 0;
      
      totalReceived += amtReceived;
      runningBalance = Math.max(0, runningBalance - amtReceived);

      // Update cells in grid
      updatedGrid[r][4] = `₹${amtReceived.toLocaleString("en-IN")}`;
      updatedGrid[r][5] = `₹${runningBalance.toLocaleString("en-IN")}`;
    }

    // 3. Update Demographics summary values
    updatedGrid[4][5] = `INR ${totalReceived.toLocaleString("en-IN")}`;
    updatedGrid[5][5] = `INR ${runningBalance.toLocaleString("en-IN")}`;

    return updatedGrid;
  };

  useEffect(() => {
    // Initialize sheet grid values ONCE on mount
    const initialGrid = Array(rowCount).fill(null).map(() => Array(colCount).fill(""));

    // Title banner
    initialGrid[0][0] = "HOMEO HEALTHCARE - CLINICAL CASE SHEET";
    
    // Demographics header
    initialGrid[2][0] = "1. PATIENT DEMOGRAPHICS";
    
    // Row 4
    initialGrid[3][0] = "Patient ID";
    initialGrid[3][1] = id;
    initialGrid[3][2] = "Register Date";
    initialGrid[3][3] = today;
    initialGrid[3][4] = "Total Package Price";
    initialGrid[3][5] = `INR ${finalPrice.toLocaleString("en-IN")}`;

    // Row 5
    initialGrid[4][0] = "Patient Name";
    initialGrid[4][1] = name;
    initialGrid[4][2] = "Age / Gender";
    initialGrid[4][3] = `${age} / ${gender}`;
    initialGrid[4][4] = "Received Total";
    initialGrid[4][5] = `INR ${initialReceived.toLocaleString("en-IN")}`;

    // Row 6
    initialGrid[5][0] = "Contact Phone";
    initialGrid[5][1] = phone;
    initialGrid[5][2] = "Email Address";
    initialGrid[5][3] = email;
    initialGrid[5][4] = "Remaining Balance";
    initialGrid[5][5] = `INR ${initialBalance.toLocaleString("en-IN")}`;

    // Row 7
    initialGrid[6][0] = "Delivery Option";
    initialGrid[6][1] = "Courier Shipping";
    initialGrid[6][2] = "Location / Address";
    initialGrid[6][3] = "Pune, Maharashtra, India";
    initialGrid[6][4] = "";
    initialGrid[6][5] = "";

    // Row 8
    initialGrid[7][0] = "Recommended Tier";
    initialGrid[7][1] = careLevel;
    initialGrid[7][2] = "Billing Duration";
    initialGrid[7][3] = durationText;
    initialGrid[7][4] = "";
    initialGrid[7][5] = "";

    // Section 2 Header
    initialGrid[9][0] = "2. CHIEF COMPLAINT & CASE ANALYSIS";
    initialGrid[10][0] = "Chief Complaint Details";
    initialGrid[10][1] = complaint; // Merged across B11:F14

    // Section 3 Header
    initialGrid[14][0] = "3. CLINICAL REPERTORIZATION & RUBRICS";
    initialGrid[15][0] = "Rubric Name";
    initialGrid[15][1] = "Chapter / Location";
    initialGrid[15][2] = "Remedy Grade (1/2/3)";
    initialGrid[15][3] = "Clinical Notes & Key Modalities";
    initialGrid[15][4] = "";
    initialGrid[15][5] = "";

    // Standard rubrics suggestions
    initialGrid[16][0] = "Stomach - Acidity - eating, after";
    initialGrid[16][1] = "Stomach";
    initialGrid[16][2] = "3";
    initialGrid[16][3] = "Violent burning, worse post-meals";

    initialGrid[17][0] = "Mind - Irritability";
    initialGrid[17][1] = "Mind";
    initialGrid[17][2] = "2";
    initialGrid[17][3] = "Anxious restlessness";

    initialGrid[18][0] = "Generalities - Chilly";
    initialGrid[18][1] = "Generalities";
    initialGrid[18][2] = "3";
    initialGrid[18][3] = "Extreme sensitivity to drafts";

    // Section 4 Header
    initialGrid[22][0] = "4. PRESCRIPTION & TREATMENT PLAN";
    initialGrid[23][0] = "Remedy Prescribed";
    initialGrid[23][1] = "Potency & Scale";
    initialGrid[23][2] = "Dosage & Frequency";
    initialGrid[23][3] = "Duration & Schedule";
    initialGrid[23][4] = "";
    initialGrid[23][5] = "";

    initialGrid[24][0] = "Nux Vomica";
    initialGrid[24][1] = "30C";
    initialGrid[24][2] = "4 pills, twice daily";
    initialGrid[24][3] = "14 Days (Bedtime/Morning)";

    initialGrid[25][0] = "Arsenicum Album";
    initialGrid[25][1] = "200C";
    initialGrid[25][2] = "4 pills, single dose";
    initialGrid[25][3] = "SOS (For acute gastric distress)";

    // Remaining prescription slots (remedies slots run from index 24 to 35, giving 12 total rows for prescriptions)
    for (let r = 26; r <= 35; r++) {
      initialGrid[r][0] = "";
      initialGrid[r][1] = "";
      initialGrid[r][2] = "";
      initialGrid[r][3] = "";
    }

    // Section 5 Header (Follow-ups starting at index 36 / row 37)
    initialGrid[36][0] = "5. CLINICAL PROGRESS & FOLLOW-UPS";
    initialGrid[37][0] = "Date";
    initialGrid[37][1] = "Symptom Status & Patient Report";
    initialGrid[37][2] = "Prescription Adjustments";
    initialGrid[37][3] = "Next Review Date";
    initialGrid[37][4] = "Amount Received (₹)";
    initialGrid[37][5] = "Balance / Due (₹)";

    // First follow-up active row
    initialGrid[38][0] = today;
    initialGrid[38][1] = "Case initialized. Symptoms documented.";
    initialGrid[38][2] = "Nux Vomica 30C + Ars Alb 200C prescribed.";
    initialGrid[38][3] = "After 2 weeks";
    initialGrid[38][4] = `₹${initialReceived.toLocaleString("en-IN")}`;
    initialGrid[38][5] = `₹${initialBalance.toLocaleString("en-IN")}`;

    // Fill the remaining follow-up slots as empty
    for (let index = 1; index < 6; index++) {
      const targetRow = 38 + index;
      initialGrid[targetRow][0] = "";
      initialGrid[targetRow][1] = "";
      initialGrid[targetRow][2] = "";
      initialGrid[targetRow][3] = "";
      initialGrid[targetRow][4] = "";
      initialGrid[targetRow][5] = "";
    }

    setGrid(initialGrid);
  }, []); // Run ONLY once on mount

  const handleAddFollowUp = () => {
    const nextDate = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
    const targetRow = 38 + activeFollowUpCount;
    
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Expand grid if needed
      while (targetRow >= newGrid.length) {
        newGrid.push(Array(colCount).fill(""));
      }

      newGrid[targetRow][0] = nextDate;
      newGrid[targetRow][1] = `Follow-up ${activeFollowUpCount + 1} Status (Double-click to edit)`;
      newGrid[targetRow][2] = "Adjustments";
      newGrid[targetRow][3] = "2 Weeks";
      newGrid[targetRow][4] = "₹0";
      newGrid[targetRow][5] = "₹0";

      const newCount = activeFollowUpCount + 1;
      setActiveFollowUpCount(newCount);
      return recalculateLedger(newGrid, newCount);
    });
  };

  const handleRemoveFollowUp = () => {
    if (activeFollowUpCount > 1) {
      const targetRow = 38 + activeFollowUpCount - 1;
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[targetRow][0] = "";
        newGrid[targetRow][1] = "";
        newGrid[targetRow][2] = "";
        newGrid[targetRow][3] = "";
        newGrid[targetRow][4] = "";
        newGrid[targetRow][5] = "";

        const newCount = activeFollowUpCount - 1;
        setActiveFollowUpCount(newCount);
        return recalculateLedger(newGrid, newCount);
      });
    }
  };

  const handleCellClick = (r: number, c: number) => {
    // Don't allow editing main section banners
    if (r === 0 || r === 2 || r === 9 || r === 14 || r === 22 || r === 36) return;
    
    // Don't allow editing headers of tables
    if (r === 15 || r === 23 || r === 37) return;

    // Don't allow editing the running balance column of follow-up rows
    const displayCount = Math.max(6, activeFollowUpCount);
    if (r >= 38 && r < 38 + displayCount && c === 5) {
      alert("Remaining balance is automatically calculated as a running total based on amount received.");
      return;
    }

    setEditingCell({ row: r, col: c });
    setEditValue(grid[r]?.[c] || "");
  };

  const handleSaveCell = () => {
    if (editingCell) {
      const { row, col } = editingCell;
      
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        let val = editValue;

        // If user double-clicked and filled an empty follow-up slot, increment active count
        if (row >= 38) {
          const index = row - 38;
          if (index >= activeFollowUpCount) {
            setActiveFollowUpCount(index + 1);
          }
          if (col === 4 || col === 5) {
            val = editValue.replace("₹", "").trim();
          }
        }

        newGrid[row][col] = val;
        return recalculateLedger(newGrid);
      });

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

  const isSectionHeader = (r: number) => {
    return r === 2 || r === 9 || r === 14 || r === 22 || r === 36;
  };

  const isTableHeader = (r: number) => {
    return r === 15 || r === 23 || r === 37;
  };

  const displayCount = Math.max(6, activeFollowUpCount);
  const patientName = grid[4]?.[1] || name;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none pb-12">
      {/* Top Banner Alert */}
      <div className="bg-amber-600 text-white px-5 py-4 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-md border-b border-amber-700/30">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-100 animate-pulse shrink-0" />
          <div className="text-xs sm:text-sm font-semibold tracking-wide">
            <span className="font-extrabold uppercase text-amber-200">Google Sheets Sandbox Mode</span> — This is an interactive preview. Live patient sheets generated on Google Drive open in a separate tab with full formulas, scripts, and tab functionality.
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all border border-white/25 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Google Sheets-like Toolbar Mockup */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 shadow-sm border border-teal-100/50">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              {patientName} - Clinical Record
              <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-100/50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Preview Sandbox
              </span>
            </h1>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold mt-1">
              <span className="hover:text-slate-600 cursor-pointer font-bold text-teal-700">File</span>
              <span className="hover:text-slate-600 cursor-pointer">Edit</span>
              <span className="hover:text-slate-600 cursor-pointer">View</span>
              <span className="hover:text-slate-600 cursor-pointer">Insert</span>
              <span className="hover:text-slate-600 cursor-pointer">Format</span>
              <span className="hover:text-slate-600 cursor-pointer">Data</span>
              <span className="hover:text-slate-600 cursor-pointer">Tools</span>
              <span className="text-slate-300">|</span>
              <span className="text-teal-700 flex items-center gap-1.5 font-bold">
                <Check className="w-3.5 h-3.5 text-teal-600" /> Auto-expanding enabled
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Follow-up Action buttons */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleAddFollowUp}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-[0_3px_10px_rgba(13,148,136,0.2)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Follow-up</span>
          </button>
          
          {activeFollowUpCount > 1 && (
            <button
              onClick={handleRemoveFollowUp}
              className="flex items-center gap-1.5 px-4.5 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Last</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-150">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Double-click cells to edit billing/notes</span>
          </div>
        </div>
      </div>

      {/* Main Spreadsheet Viewer */}
      <div className="flex-1 p-4 sm:p-8 flex justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-6xl w-full overflow-hidden flex flex-col">
          
          {/* Native scroll container for smooth user interaction with max height vertical scroll */}
          <div className="overflow-auto w-full border-b border-slate-150 max-h-[70vh]">
            {grid.length > 0 && (
              <table className="border-collapse table-fixed w-full min-w-[1050px]">
                <thead>
                  <tr className="bg-slate-50 text-center text-[10px] text-slate-400 font-bold border-b border-slate-200 h-7 sticky top-0 z-20">
                    <th className="w-10 border-r border-slate-200 bg-slate-100 sticky top-0 left-0 z-40"></th>
                    <th className="w-[170px] border-r border-slate-200 bg-slate-50 sticky top-0 z-20">A</th>
                    <th className="w-[250px] border-r border-slate-200 bg-slate-50 sticky top-0 z-20">B</th>
                    <th className="w-[170px] border-r border-slate-200 bg-slate-50 sticky top-0 z-20">C</th>
                    <th className="w-[200px] border-r border-slate-200 bg-slate-50 sticky top-0 z-20">D</th>
                    <th className="w-[130px] border-r border-slate-200 bg-slate-50 sticky top-0 z-20">E</th>
                    <th className="w-[130px] bg-slate-50 sticky top-0 z-20">F</th>
                  </tr>
                </thead>
                <tbody>
                  {grid.map((rowCells, rIndex) => {
                    // A1 Header Banner spanning all columns
                    if (rIndex === 0) {
                      return (
                        <tr key={rIndex} className="h-14 border-b border-slate-200">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold sticky left-0 z-10">{rIndex + 1}</td>
                          <td
                            colSpan={6}
                            className="bg-[#0f766e] text-white text-center font-extrabold text-sm tracking-widest uppercase vertical-middle align-middle font-sans px-4 shadow-inner"
                          >
                            {rowCells[0]}
                          </td>
                        </tr>
                      );
                    }

                    // Section headers merged
                    if (isSectionHeader(rIndex)) {
                      return (
                        <tr key={rIndex} className="h-9 border-b border-slate-200">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold sticky left-0 z-10">{rIndex + 1}</td>
                          <td
                            colSpan={6}
                            className="bg-[#e2fbf7] text-[#0f766e] font-black text-xs px-4 text-left uppercase tracking-wider vertical-middle align-middle"
                          >
                            {rowCells[0]}
                          </td>
                        </tr>
                      );
                    }

                    // Table Headers
                    if (isTableHeader(rIndex)) {
                      return (
                        <tr key={rIndex} className="h-9 border-b border-slate-200">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold sticky left-0 z-10">{rIndex + 1}</td>
                          {rowCells.slice(0, 6).map((val, cIndex) => (
                            <td
                              key={cIndex}
                              className="bg-slate-50 border-r border-slate-200 text-left font-black text-[10px] text-slate-700 px-4 uppercase tracking-widest vertical-middle align-middle"
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      );
                    }

                    // Row 11 (Chief complaint label A11 and merged textbox B11:F14)
                    if (rIndex === 10) {
                      return (
                        <tr key={rIndex} className="border-b border-slate-150">
                          <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold sticky left-0 z-10" style={{ height: "100px" }}>11</td>
                          {/* Col A Label */}
                          <td className="border-r border-slate-200 text-[11px] font-black text-slate-800 bg-slate-50/40 p-3.5 vertical-top align-top tracking-wide">
                            {rowCells[0]}
                          </td>
                          {/* Merged Col B to F details box */}
                          <td
                            colSpan={5}
                            className="p-4 text-[11px] text-slate-700 font-medium cursor-pointer align-top hover:bg-teal-50/20 transition-colors leading-relaxed"
                            style={{ verticalAlign: "top", wordBreak: "break-word", whiteSpace: "normal" }}
                            onDoubleClick={() => handleCellClick(10, 1)}
                          >
                            {editingCell?.row === 10 && editingCell?.col === 1 ? (
                              <textarea
                                className="w-full h-full min-h-[85px] p-2.5 border border-teal-500 rounded-xl bg-white text-[11px] font-medium text-slate-850 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none shadow-sm"
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

                    // Hide rows 12, 13, 14 as they are visually merged into row 11 for the complaint box
                    if (rIndex === 11 || rIndex === 12 || rIndex === 13) {
                      return (
                        <tr key={rIndex} className="hidden">
                          <td></td>
                        </tr>
                      );
                    }

                    // Style follow-up rows specifically (starts at Row 39 / index 38)
                    const isFollowUpRow = rIndex >= 38 && rIndex < 38 + displayCount;

                    // Normal rows
                    return (
                      <tr key={rIndex} className={`h-9 border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${isFollowUpRow ? "bg-teal-50/5" : ""}`}>
                        <td className="bg-slate-100 border-r border-slate-200 text-center text-[10px] text-slate-400 font-bold sticky left-0 z-10">{rIndex + 1}</td>
                        {rowCells.slice(0, 6).map((val, cIndex) => {
                          const isLabel = (rIndex >= 3 && rIndex <= 8) && (cIndex === 0 || cIndex === 2 || cIndex === 4);
                          const isDemographicData = (rIndex >= 3 && rIndex <= 8) && (cIndex === 1 || cIndex === 3 || cIndex === 5);
                          
                          return (
                            <td
                              key={cIndex}
                              onDoubleClick={() => handleCellClick(rIndex, cIndex)}
                              className={`border-r border-slate-100 text-[11px] px-4 font-medium truncate ${
                                isLabel 
                                  ? "bg-slate-55/30 text-slate-800 font-black border-r border-slate-200 tracking-wide" 
                                  : isDemographicData
                                    ? "text-slate-900 font-semibold"
                                    : isFollowUpRow && cIndex === 0
                                      ? "text-teal-700 font-extrabold flex items-center gap-1.5"
                                      : isFollowUpRow && (cIndex === 4 || cIndex === 5)
                                        ? "text-teal-800 font-bold bg-teal-50/10"
                                        : "text-slate-650"
                              } cursor-pointer`}
                            >
                              {editingCell?.row === rIndex && editingCell?.col === cIndex ? (
                                <input
                                  type="text"
                                  className="w-full h-full p-1 border border-teal-500 rounded-lg bg-white text-[11px] font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onBlur={handleSaveCell}
                                  onKeyDown={handleKeyDown}
                                  autoFocus
                                />
                              ) : (
                                <>
                                  {isFollowUpRow && cIndex === 0 && <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0 inline-block mr-1" />}
                                  {isFollowUpRow && (cIndex === 4 || cIndex === 5) && val !== "₹0" && val !== "₹" && <IndianRupee className="w-3.5 h-3.5 text-teal-600 shrink-0 inline-block mr-0.5" />}
                                  {isFollowUpRow && (cIndex === 4 || cIndex === 5) ? val.replace("₹", "") : val}
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Grid Footer Information */}
          <div className="bg-slate-50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-slate-400" />
              <span>Grid Range: Sheet1!A1:F{rowCount} (6-Column Matrix)</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Each follow-up has custom billing logs. Total summaries update in real-time above.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function MockSheetPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading Clinical Case Sheet...</div>}>
      <MockSheetContent />
    </Suspense>
  );
}
