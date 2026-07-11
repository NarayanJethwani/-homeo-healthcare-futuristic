"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, Activity, Sparkles, Brain, Shield, AlertTriangle, 
  Check, X, FileText, ArrowRight, Plus, Trash2, Heart
} from "lucide-react";

// Import Shared primitives
import { toPatientId, toEpisodeId } from "@/shared/domain/identifiers";
import { DomainEventDispatcher, DomainEvent } from "@/shared/events/eventDispatcher";

// Import Patient Feature
import { 
  Patient, PatientDemographics, PatientGender, 
  MockPatientRepository, PatientService 
} from "@/features/patient";

// Import Allergy Feature
import { 
  AllergyIntolerance, AllergyCategory, AllergyCriticality, 
  MockAllergyRepository, AllergyService 
} from "@/features/allergy";

// Import Consent Feature
import { 
  PatientConsent, ConsentType, CaptureMethod, 
  MockConsentRepository, ConsentService 
} from "@/features/consent";

// Import Episode Feature
import { 
  TreatmentEpisode, EpisodeStatus, 
  MockEpisodeRepository, EpisodeService 
} from "@/features/treatment-episode";

// Initialize mock repos and services for dev foundation verification
const patientRepo = new MockPatientRepository();
const allergyRepo = new MockAllergyRepository();
const consentRepo = new MockConsentRepository();
const episodeRepo = new MockEpisodeRepository();

const patientService = new PatientService(patientRepo);
const allergyService = new AllergyService(allergyRepo);
const consentService = new ConsentService(consentRepo);
const episodeService = new EpisodeService(episodeRepo);

export default function ClinicalConsole() {
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<AllergyIntolerance[]>([]);
  const [consentStatuses, setConsentStatuses] = useState<Record<ConsentType, boolean>>({
    privacy: false,
    telemedicine: false,
    ai_processing: false,
    research: false,
    communication: false
  });
  const [episodes, setEpisodes] = useState<TreatmentEpisode[]>([]);
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const [searchUhid, setSearchUhid] = useState("");
  const [verificationOutput, setVerificationOutput] = useState<string>("");

  // Form states
  const [regName, setRegName] = useState("Aarav Sharma");
  const [regDob, setRegDob] = useState("1988-05-15");
  const [regGender, setRegGender] = useState<PatientGender>("male");
  const [regPhone, setRegPhone] = useState("9876543210");
  const [regEmail, setRegEmail] = useState("aarav.sharma@example.com");
  const [regAddress, setRegAddress] = useState("MG Road, Pune, Maharashtra");
  const [regEmergencyName, setRegEmergencyName] = useState("Priya Sharma");
  const [regEmergencyPhone, setRegEmergencyPhone] = useState("9876543211");
  const [regEmergencyRel, setRegEmergencyRel] = useState("Spouse");

  const [allergySubstance, setAllergySubstance] = useState("Penicillin");
  const [allergyCategory, setAllergyCategory] = useState<AllergyCategory>("medication");
  const [allergyCriticality, setAllergyCriticality] = useState<AllergyCriticality>("high");
  const [allergyReaction, setAllergyReaction] = useState("Urticaria and anaphylaxis flare");

  const [episodeTitle, setEpisodeTitle] = useState("Chronic Acid Dyspepsia / GERD");

  // Sync event listener to console logs
  useEffect(() => {
    const handleDomainEvent = (event: DomainEvent) => {
      const logStr = `[Event Dispatched] ${event.eventType} - ${new Date(event.timestamp).toLocaleTimeString()} - ${JSON.stringify(event.payload)}`;
      setEventLogs(prev => [logStr, ...prev]);
    };

    DomainEventDispatcher.subscribe("patient.created", handleDomainEvent);
    DomainEventDispatcher.subscribe("allergy.created", handleDomainEvent);
    DomainEventDispatcher.subscribe("consent.granted", handleDomainEvent);
    DomainEventDispatcher.subscribe("consent.withdrawn", handleDomainEvent);
    DomainEventDispatcher.subscribe("episode.created", handleDomainEvent);
    DomainEventDispatcher.subscribe("episode.closed", handleDomainEvent);

    return () => {
      DomainEventDispatcher.unsubscribe("patient.created", handleDomainEvent);
      DomainEventDispatcher.unsubscribe("allergy.created", handleDomainEvent);
      DomainEventDispatcher.unsubscribe("consent.granted", handleDomainEvent);
      DomainEventDispatcher.unsubscribe("consent.withdrawn", handleDomainEvent);
      DomainEventDispatcher.unsubscribe("episode.created", handleDomainEvent);
      DomainEventDispatcher.unsubscribe("episode.closed", handleDomainEvent);
    };
  }, []);

  const addLog = (msg: string) => {
    setVerificationOutput(prev => `[${new Date().toLocaleTimeString()}] ${msg}\n${prev}`);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const demographics: PatientDemographics = {
        name: regName,
        dateOfBirth: regDob,
        gender: regGender,
        phone: regPhone,
        email: regEmail,
        address: regAddress,
        emergencyContact: {
          name: regEmergencyName,
          phone: regEmergencyPhone,
          relationship: regEmergencyRel
        }
      };

      addLog(`Registering new patient: ${regName}...`);
      const patient = await patientService.registerPatient({
        organizationId: "org_homeo_premium",
        clinicId: "clinic_pune_baner",
        createdBy: "doc_jethwani_007",
        demographics
      });

      setActivePatient(patient);
      setSearchUhid(patient.uhid);
      addLog(`SUCCESS: Patient registered with UHID: ${patient.uhid}. Entity Version: ${patient.recordVersion}`);
      
      // Auto-load lists
      await refreshPatientData(patient.id);
    } catch (err: any) {
      addLog(`ERROR during registration: ${err.message}. Details: ${JSON.stringify(err.details || {})}`);
    }
  };

  const handleSearch = async () => {
    if (!searchUhid.trim()) return;
    addLog(`Searching patient by UHID: ${searchUhid}...`);
    const patient = await patientService.getPatientByUhid(searchUhid.trim());
    if (patient) {
      setActivePatient(patient);
      addLog(`SUCCESS: Found patient: ${patient.name} (UHID: ${patient.uhid})`);
      await refreshPatientData(patient.id);
    } else {
      addLog(`WARNING: No patient found with UHID: ${searchUhid}`);
      setActivePatient(null);
      setAllergies([]);
      setEpisodes([]);
    }
  };

  const refreshPatientData = async (patientId: string) => {
    const listAllergies = await allergyService.getPatientAllergies(patientId);
    setAllergies(listAllergies);

    const listEpisodes = await episodeService.getPatientEpisodes(patientId);
    setEpisodes(listEpisodes);

    // Refresh consents
    const privacy = await consentService.verifyConsent(patientId, "privacy");
    const telemedicine = await consentService.verifyConsent(patientId, "telemedicine");
    const ai_processing = await consentService.verifyConsent(patientId, "ai_processing");
    const research = await consentService.verifyConsent(patientId, "research");
    const communication = await consentService.verifyConsent(patientId, "communication");

    setConsentStatuses({ privacy, telemedicine, ai_processing, research, communication });
  };

  const handleToggleConsent = async (type: ConsentType) => {
    if (!activePatient) return;
    const currentStatus = consentStatuses[type];
    const newStatus = !currentStatus;
    addLog(`Toggling consent ${type} to ${newStatus}...`);

    try {
      await consentService.recordConsent({
        organizationId: activePatient.organizationId,
        patientId: activePatient.id,
        consentType: type,
        granted: newStatus,
        policyVersion: "v1.0.0",
        language: "en",
        capturedBy: "doc_jethwani_007",
        captureMethod: "digital_signature"
      });

      addLog(`SUCCESS: Consent ${type} recorded as ${newStatus ? "GRANTED" : "WITHDRAWN"}`);
      await refreshPatientData(activePatient.id);
    } catch (err: any) {
      addLog(`ERROR toggling consent: ${err.message}`);
    }
  };

  const handleAddAllergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;
    addLog(`Adding allergy record for ${allergySubstance}...`);

    try {
      await allergyService.recordAllergy({
        organizationId: activePatient.organizationId,
        patientId: activePatient.id,
        substanceText: allergySubstance,
        category: allergyCategory,
        criticality: allergyCriticality,
        reactionDescriptions: [allergyReaction],
        createdBy: "doc_jethwani_007",
        notes: "Recorded during intake verification"
      });

      addLog(`SUCCESS: Allergy intolerance record saved.`);
      await refreshPatientData(activePatient.id);
      setAllergySubstance("");
    } catch (err: any) {
      addLog(`ERROR recording allergy: ${err.message}`);
    }
  };

  const handleStartEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;
    addLog(`Starting treatment course: "${episodeTitle}"...`);

    try {
      await episodeService.startEpisode({
        organizationId: activePatient.organizationId,
        patientId: activePatient.id,
        title: episodeTitle,
        conditionConceptIds: ["concept_dyspepsia_001"],
        primaryPractitionerId: "doc_jethwani_007",
        createdBy: "doc_jethwani_007"
      });

      addLog(`SUCCESS: Treatment course started.`);
      await refreshPatientData(activePatient.id);
      setEpisodeTitle("");
    } catch (err: any) {
      addLog(`ERROR starting treatment course: ${err.message}`);
    }
  };

  const handleResolveEpisode = async (episodeId: string) => {
    if (!activePatient) return;
    addLog(`Resolving treatment course ID ${episodeId}...`);

    try {
      await episodeService.closeEpisode(episodeId, "doc_jethwani_007", "Symptoms controlled, treatment finished.");
      addLog(`SUCCESS: Treatment course resolved.`);
      await refreshPatientData(activePatient.id);
    } catch (err: any) {
      addLog(`ERROR closing treatment course: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Dev warning banner */}
      <div className="bg-amber-950/80 border border-amber-800 text-amber-200 px-4 py-2.5 rounded-xl flex items-center gap-3 mb-6 shadow-lg shadow-amber-950/20" role="alert">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Offline clinical storage is currently restricted to synthetic test data.
        </span>
      </div>

      <header className="mb-8 flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
            <Brain className="w-7 h-7 text-emerald-500" />
            Clinical Intelligence Platform
          </h1>
          <p className="text-xs text-slate-500 mt-1">Milestone 1 Foundation Verification console</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Registry */}
        <div className="space-y-6">
          <section className="bg-slate-900 border border-slate-800/80 rounded-xl p-5" aria-labelledby="sec-search">
            <h2 id="sec-search" className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Find Patient By UHID
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchUhid}
                onChange={e => setSearchUhid(e.target.value)}
                placeholder="P-100234"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800/80 rounded-xl p-5" aria-labelledby="sec-register">
            <h2 id="sec-register" className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Register Patient (Synthetic Data)
            </h2>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={regDob}
                    onChange={e => setRegDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={e => setRegGender(e.target.value as PatientGender)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Address</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="border-t border-slate-800 pt-2 mt-2">
                <label className="block text-[10px] text-emerald-400 font-bold uppercase mb-2">Emergency Contact</label>
                <div className="grid grid-cols-3 gap-1">
                  <input
                    type="text"
                    placeholder="Name"
                    value={regEmergencyName}
                    onChange={e => setRegEmergencyName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={regEmergencyPhone}
                    onChange={e => setRegEmergencyPhone(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Relation"
                    value={regEmergencyRel}
                    onChange={e => setRegEmergencyRel(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Register & Initialize EMR
              </button>
            </form>
          </section>
        </div>

        {/* Center Column: Patient EMR Records & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {activePatient ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demographics Card */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full">
                    {activePatient.uhid}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{activePatient.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activePatient.gender} • DOB: {activePatient.dateOfBirth}</p>
                </div>
                <div className="text-xs space-y-1.5 text-slate-300 border-t border-slate-800 pt-3">
                  <p><span className="text-slate-500 font-medium">Contact:</span> {activePatient.phone} | {activePatient.email}</p>
                  <p><span className="text-slate-500 font-medium">Address:</span> {activePatient.address}</p>
                  <p><span className="text-slate-500 font-medium">Emergency:</span> {activePatient.emergencyContact.name} ({activePatient.emergencyContact.relationship}) - {activePatient.emergencyContact.phone}</p>
                  <p><span className="text-slate-500 font-medium">Tenant Org:</span> {activePatient.organizationId}</p>
                </div>

                {/* Consents Section */}
                <div className="border-t border-slate-800 pt-4">
                  <h4 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Patient Legal Consents
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(consentStatuses) as ConsentType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => handleToggleConsent(type)}
                        className={`px-3 py-1.5 rounded-lg border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          consentStatuses[type] 
                            ? "bg-emerald-950/30 border-emerald-800 text-emerald-400" 
                            : "bg-slate-950 border-slate-850 text-slate-500"
                        }`}
                      >
                        <span className="capitalize">{type.replace("_", " ")}</span>
                        {consentStatuses[type] ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side EMR additions */}
              <div className="space-y-6">
                {/* Allergy Intake */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-emerald-400" /> Allergies & Intolerances
                  </h3>
                  {allergies.length > 0 ? (
                    <div className="space-y-2 mb-4 max-h-[140px] overflow-y-auto pr-1">
                      {allergies.map(a => (
                        <div key={a.id} className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex items-start justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{a.substanceText}</p>
                            <p className="text-[10px] text-slate-400 capitalize">{a.category} • Criticality: {a.criticality}</p>
                            {a.reactionDescriptions.map((r, i) => (
                              <p key={i} className="text-[10px] text-amber-500/90 mt-0.5">Reaction: {r}</p>
                            ))}
                          </div>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">
                            {a.verificationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic mb-4">No active allergy records found.</p>
                  )}

                  <form onSubmit={handleAddAllergy} className="space-y-2 border-t border-slate-800 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Substance name"
                        value={allergySubstance}
                        onChange={e => setAllergySubstance(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Reaction details"
                        value={allergyReaction}
                        onChange={e => setAllergyReaction(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={allergyCategory}
                        onChange={e => setAllergyCategory(e.target.value as AllergyCategory)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none text-slate-400"
                      >
                        <option value="medication">Medication</option>
                        <option value="food">Food</option>
                        <option value="environment">Environment</option>
                        <option value="biologic">Biologic</option>
                        <option value="other">Other</option>
                      </select>
                      <select
                        value={allergyCriticality}
                        onChange={e => setAllergyCriticality(e.target.value as AllergyCriticality)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none text-slate-400"
                      >
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-1 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-[11px] font-bold tracking-wide cursor-pointer text-slate-300">
                      + Add Allergy Intolerance Record
                    </button>
                  </form>
                </div>

                {/* Treatment Episodes */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Active Course of Care (Episodes)
                  </h3>
                  {episodes.length > 0 ? (
                    <div className="space-y-2 mb-4 max-h-[140px] overflow-y-auto pr-1">
                      {episodes.map(e => (
                        <div key={e.id} className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{e.title}</p>
                            <p className="text-[9px] text-slate-500">Started: {new Date(e.startedAt).toLocaleDateString()}</p>
                            {e.resolutionSummary && (
                              <p className="text-[10px] text-emerald-400/90 mt-0.5">Outcome: {e.resolutionSummary}</p>
                            )}
                            {e.status === "active" && (
                              <div className="mt-2">
                                <Link
                                  href="/admin/encounters/synthetic-demo"
                                  className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 rounded text-[9px] font-bold cursor-pointer"
                                >
                                  Intake Workspace
                                </Link>
                              </div>
                            )}
                          </div>
                          {e.status === "active" ? (
                            <button
                              onClick={() => handleResolveEpisode(e.id)}
                              className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded text-[10px] font-bold cursor-pointer"
                            >
                              Resolve
                            </button>
                          ) : (
                            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded capitalize">
                              {e.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic mb-4">No active care episodes started.</p>
                  )}

                  <form onSubmit={handleStartEpisode} className="flex gap-2 border-t border-slate-800 pt-3">
                    <input
                      type="text"
                      placeholder="Episode / course Title"
                      value={episodeTitle}
                      onChange={e => setEpisodeTitle(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
                      required
                    />
                    <button type="submit" className="px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded text-[11px] font-bold cursor-pointer text-slate-300">
                      Start Course
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-8 text-center text-slate-500">
              <Users className="w-12 h-12 text-slate-800 mx-auto mb-3" />
              <p className="text-sm">Register a new patient or enter their UHID to verify schema validations and database services.</p>
            </div>
          )}
        </div>
      </div>

      {/* Verification Logs & Output Console */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-slate-900 pt-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Domain Events Log</h3>
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 h-[240px] overflow-y-auto font-mono text-[10px] space-y-1.5 text-emerald-400/90 pr-2">
            {eventLogs.length > 0 ? (
              eventLogs.map((log, idx) => <p key={idx}>{log}</p>)
            ) : (
              <p className="text-slate-650 italic">Waiting for events to fire...</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Console Output Logs</h3>
          <pre className="bg-slate-950 border border-slate-900 rounded-xl p-4 h-[240px] overflow-y-auto font-mono text-[10px] text-slate-350 overflow-x-auto pr-2">
            {verificationOutput || "Verification logs ready...\n"}
          </pre>
        </div>
      </div>
    </div>
  );
}
