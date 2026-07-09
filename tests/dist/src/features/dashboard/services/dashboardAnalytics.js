"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMockRecoveryTrends = getMockRecoveryTrends;
exports.getMockDiseaseDistribution = getMockDiseaseDistribution;
/**
 * Service to fetch data for recovery trends and disease spreads
 */
function getMockRecoveryTrends() {
    return [
        { month: "Jan", recoveryPercentage: 88.5, activeCasesCount: 12 },
        { month: "Feb", recoveryPercentage: 90.1, activeCasesCount: 15 },
        { month: "Mar", recoveryPercentage: 91.4, activeCasesCount: 19 },
        { month: "Apr", recoveryPercentage: 92.0, activeCasesCount: 22 },
        { month: "May", recoveryPercentage: 93.5, activeCasesCount: 26 },
        { month: "Jun", recoveryPercentage: 94.2, activeCasesCount: 31 }
    ];
}
function getMockDiseaseDistribution() {
    return [
        { name: "Psoric (Skin/Asthma)", value: 42, color: "#0d9488" }, // Teal
        { name: "Sycotic (Warts/Gerd)", value: 31, color: "#3b82f6" }, // Blue
        { name: "Syphilitic (Ulcers)", value: 15, color: "#ef4444" }, // Red
        { name: "Tubercular (Lungs)", value: 12, color: "#f59e0b" } // Amber
    ];
}
