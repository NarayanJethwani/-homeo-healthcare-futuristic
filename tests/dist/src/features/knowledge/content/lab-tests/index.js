"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TshLabTest = exports.CbcLabTest = exports.LAB_TESTS = void 0;
const cbc_1 = require("./cbc");
Object.defineProperty(exports, "CbcLabTest", { enumerable: true, get: function () { return cbc_1.CbcLabTest; } });
const tsh_1 = require("./tsh");
Object.defineProperty(exports, "TshLabTest", { enumerable: true, get: function () { return tsh_1.TshLabTest; } });
const esr_1 = require("./esr");
const crp_1 = require("./crp");
const hba1c_1 = require("./hba1c");
const lipid_profile_1 = require("./lipid-profile");
const vitamin_d_1 = require("./vitamin-d");
const vitamin_b12_1 = require("./vitamin-b12");
const ferritin_1 = require("./ferritin");
const t3_1 = require("./t3");
const t4_1 = require("./t4");
const lft_1 = require("./lft");
const kft_1 = require("./kft");
const urine_routine_1 = require("./urine-routine");
const fasting_blood_sugar_1 = require("./fasting-blood-sugar");
const postprandial_blood_sugar_1 = require("./postprandial-blood-sugar");
const serum_creatinine_1 = require("./serum-creatinine");
const blood_urea_nitrogen_1 = require("./blood-urea-nitrogen");
const uric_acid_1 = require("./uric-acid");
const serum_calcium_1 = require("./serum-calcium");
const electrolyte_panel_1 = require("./electrolyte-panel");
const thyroid_profile_1 = require("./thyroid-profile");
const rheumatoid_factor_1 = require("./rheumatoid-factor");
const anti_ccp_1 = require("./anti-ccp");
const complete_urine_analysis_1 = require("./complete-urine-analysis");
const ana_1 = require("./ana");
const serum_iron_1 = require("./serum-iron");
const tibc_1 = require("./tibc");
const serum_potassium_1 = require("./serum-potassium");
const serum_sodium_1 = require("./serum-sodium");
const serum_magnesium_1 = require("./serum-magnesium");
const total_ige_1 = require("./total-ige");
const stool_routine_1 = require("./stool-routine");
const h_pylori_antigen_1 = require("./h-pylori-antigen");
const ft3_1 = require("./ft3");
const ft4_1 = require("./ft4");
const urine_microalbumin_1 = require("./urine-microalbumin");
const prostate_specific_antigen_1 = require("./prostate-specific-antigen");
const anti_tpo_antibodies_1 = require("./anti-tpo-antibodies");
const folic_acid_1 = require("./folic-acid");
exports.LAB_TESTS = [
    cbc_1.CbcLabTest,
    tsh_1.TshLabTest,
    esr_1.ESRLabTest,
    crp_1.CRPLabTest,
    hba1c_1.HbA1cLabTest,
    lipid_profile_1.LipidProfileLabTest,
    vitamin_d_1.VitaminDLabTest,
    vitamin_b12_1.VitaminB12LabTest,
    ferritin_1.FerritinLabTest,
    t3_1.T3LabTest,
    t4_1.T4LabTest,
    lft_1.LFTLabTest,
    kft_1.KFTLabTest,
    urine_routine_1.UrineRoutineLabTest,
    fasting_blood_sugar_1.FastingBloodSugarLabTest,
    postprandial_blood_sugar_1.PostprandialBloodSugarLabTest,
    serum_creatinine_1.SerumCreatinineLabTest,
    blood_urea_nitrogen_1.BloodUreaNitrogenLabTest,
    uric_acid_1.UricAcidLabTest,
    serum_calcium_1.SerumCalciumLabTest,
    electrolyte_panel_1.ElectrolytePanelLabTest,
    thyroid_profile_1.ThyroidProfileLabTest,
    rheumatoid_factor_1.RheumatoidFactorLabTest,
    anti_ccp_1.AntiCCPLabTest,
    complete_urine_analysis_1.CompleteUrineAnalysisLabTest,
    ana_1.ANALabTest,
    serum_iron_1.SerumIronLabTest,
    tibc_1.TIBCLabTest,
    serum_potassium_1.SerumPotassiumLabTest,
    serum_sodium_1.SerumSodiumLabTest,
    serum_magnesium_1.SerumMagnesiumLabTest,
    total_ige_1.TotalIgELabTest,
    stool_routine_1.StoolRoutineLabTest,
    h_pylori_antigen_1.HPyloriAntigenLabTest,
    ft3_1.FT3LabTest,
    ft4_1.FT4LabTest,
    urine_microalbumin_1.UrineMicroalbuminLabTest,
    prostate_specific_antigen_1.ProstateSpecificAntigenLabTest,
    anti_tpo_antibodies_1.AntiTPOAntibodiesLabTest,
    folic_acid_1.FolicAcidLabTest,
];
