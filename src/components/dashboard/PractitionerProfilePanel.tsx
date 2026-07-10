import React, { useState, useEffect } from "react";
import { 
  User, 
  Shield, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Lock, 
  Eye, 
  Activity, 
  ToggleLeft, 
  ToggleRight, 
  HelpCircle,
  EyeOff
} from "lucide-react";
import { ProfileClient } from "@/features/practitioner-profile/profileClient";
import { PractitionerProfileView } from "@/features/practitioner-profile/types";
import { PractitionerPreferences } from "@/features/practitioner-profile/preferences";

interface PractitionerProfilePanelProps {
  session: any;
}

export function PractitionerProfilePanel({ session }: PractitionerProfilePanelProps) {
  const [profile, setProfile] = useState<PractitionerProfileView | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  
  // Preferences states
  const [compactMode, setCompactMode] = useState(false);
  const [showClinicalDisclaimers, setShowClinicalDisclaimers] = useState(true);
  const [defaultTab, setDefaultTab] = useState("dashboard");
  
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [prefSaveSuccess, setPrefSaveSuccess] = useState(false);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await ProfileClient.getProfile();
      if (profileRes.success && profileRes.profile) {
        const p = profileRes.profile;
        setProfile(p);
        setDisplayName(p.displayName || "");
        setSpecialties(p.specialties ? p.specialties.join(", ") : "");
        setClinicLocation(p.clinicLocation || "");
        
        // Parse preferences from notes if present
        let compact = false;
        let showDisclaimers = true;
        let tab = "dashboard";
        
        // Simulating loading preferences from profile notes structure (or mock local notes payload)
        const notesStr = (p as any).notes || "";
        const prefMatch = notesStr.match(/\[PREFERENCES:(.*)\]/);
        if (prefMatch) {
          try {
            const prefs = JSON.parse(prefMatch[1]) as PractitionerPreferences;
            compact = !!prefs.compactMode;
            showDisclaimers = prefs.showClinicalDisclaimers !== false;
            tab = prefs.defaultDashboardTab || "dashboard";
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        setCompactMode(compact);
        setShowClinicalDisclaimers(showDisclaimers);
        setDefaultTab(tab);
      }
      
      const activityRes = await ProfileClient.getSecurityActivity();
      if (activityRes.success) {
        setActivity(activityRes.activity);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load account profile data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const specialtiesArray = specialties
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      const res = await ProfileClient.updateProfile({
        displayName,
        clinicLocation,
        specialties: specialtiesArray
      });
      
      if (res.success) {
        setProfile(res.profile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Refresh security activity timeline
        const activityRes = await ProfileClient.getSecurityActivity();
        if (activityRes.success) {
          setActivity(activityRes.activity);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSavePreferences = async (tab: string, compact: boolean, disclaimers: boolean) => {
    setPrefSaveSuccess(false);
    try {
      const res = await ProfileClient.savePreferences({
        defaultDashboardTab: tab,
        compactMode: compact,
        showClinicalDisclaimers: disclaimers
      });
      if (res.success) {
        setPrefSaveSuccess(true);
        setTimeout(() => setPrefSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save preferences.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-950 rounded-3xl border border-slate-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400 font-medium">Loading profile credentials...</p>
        </div>
      </div>
    );
  }

  // Account Restrictions Overlays if suspended or deactivated
  const isSuspended = profile?.status === "suspended";
  const isDeactivated = profile?.status === "deactivated";
  
  // Subscription status expiration check
  const isExpired = profile?.subscriptionExpiresAt 
    ? new Date(profile.subscriptionExpiresAt) < new Date()
    : false;

  if (isSuspended || isDeactivated) {
    return (
      <div className="max-w-4xl mx-auto my-12 bg-slate-950 border border-red-900/60 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-red-950/10 pointer-events-none"></div>
        <div className="w-20 h-20 bg-red-950/40 border border-red-800/80 rounded-full flex items-center justify-center mx-auto text-red-500">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-red-400">Account Access Suspended</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Your clinical practitioner profile ({profile?.email}) has been marked as {profile?.status} by the system administrator. All administrative and medical analysis features are restricted.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl max-w-md mx-auto text-left space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access Guidelines</span>
          <p className="text-xs text-slate-400">
            For reactivation requests, license questions, or to appeal restriction logs, please contact the lead administrator.
          </p>
        </div>
        <div className="pt-4">
          <a 
            href="mailto:admin@homeo.healthcare" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg"
          >
            Contact Administrator
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn my-6">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 shadow-md">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-100">{profile?.displayName || "Practitioner Profile"}</h2>
            <p className="text-xs text-slate-400 font-sans">{profile?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isExpired 
              ? "bg-rose-950/40 text-rose-400 border-rose-900/50" 
              : "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
          }`}>
            {isExpired ? "Subscription Expired" : "License Active"}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {profile?.role}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-900/50 text-rose-400 px-6 py-4 rounded-2xl flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* 2. Expired Restricted Mode Block Banner */}
      {isExpired && (
        <div className="bg-amber-950/30 border border-amber-900/50 text-amber-300 px-6 py-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Subscription Expired ({profile?.subscriptionExpiresAt ? new Date(profile.subscriptionExpiresAt).toLocaleDateString() : "Unknown"})</p>
              <p className="text-xs text-slate-400">All clinical tools and case evaluations are locked. You may still configure safe profile settings below.</p>
            </div>
          </div>
          <a
            href="mailto:admin@homeo.healthcare?subject=Subscription%20Renewal%20Request"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all"
          >
            Request Renewal
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Updates */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Form Card */}
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-slate-100">Personal Account Details</h3>
                <p className="text-xs text-slate-500">Configure safe self-service profile information.</p>
              </div>
              <User className="w-5 h-5 text-slate-500" />
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-700"
                    placeholder="Dr. Samuel Hahnemann"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinic Location</label>
                  <input
                    type="text"
                    value={clinicLocation}
                    onChange={(e) => setClinicLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-700"
                    placeholder="Leipzig, Germany"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-slate-700"
                  placeholder="Homeopathy, Chronic Pathology, Paediatrics"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-900">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
                  </span>
                ) : (
                  <span></span>
                )}
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
                >
                  <Save className="w-4 h-4" />
                  {saveLoading ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Preferences Card */}
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-serif font-bold text-slate-100">Preferences</h3>
                <p className="text-xs text-slate-500">Configure personal workspace styles.</p>
              </div>
              <HelpCircle className="w-5 h-5 text-slate-500" />
            </div>

            <div className="space-y-6">
              {/* Default Tab Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-300">Default Landing View</span>
                  <p className="text-xs text-slate-500">Select which tab opens automatically when logging in.</p>
                </div>
                <select
                  value={defaultTab}
                  onChange={(e) => {
                    setDefaultTab(e.target.value);
                    handleSavePreferences(e.target.value, compactMode, showClinicalDisclaimers);
                  }}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 font-semibold focus:outline-none focus:border-slate-700 cursor-pointer"
                >
                  <option value="dashboard">Metrics & Status</option>
                  <option value="patients">Patients Registry</option>
                  <option value="cie">Clinical OS Dashboard</option>
                  <option value="nexus-atlas">Nexus Atlas</option>
                </select>
              </div>

              {/* Compact Mode Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-300">Compact List Density</span>
                  <p className="text-xs text-slate-500">Reduce list margins to view more rows per screen.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !compactMode;
                    setCompactMode(next);
                    handleSavePreferences(defaultTab, next, showClinicalDisclaimers);
                  }}
                  className="text-slate-400 hover:text-white transition-all bg-transparent border-none cursor-pointer p-1"
                >
                  {compactMode ? (
                    <ToggleRight className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>

              {/* Show disclaimers toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-300">Show Clinical Guidance Tips</span>
                  <p className="text-xs text-slate-500">Display secondary helper context alerts inside workbenches.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !showClinicalDisclaimers;
                    setShowClinicalDisclaimers(next);
                    handleSavePreferences(defaultTab, compactMode, next);
                  }}
                  className="text-slate-400 hover:text-white transition-all bg-transparent border-none cursor-pointer p-1"
                >
                  {showClinicalDisclaimers ? (
                    <ToggleRight className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {prefSaveSuccess && (
              <div className="pt-2 border-t border-slate-900">
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Preferences updated and saved!
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Roles & Activity logs */}
        <div className="space-y-8">
          
          {/* Access Roles and permissions list */}
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-100">Access Privileges</h3>
              <Shield className="w-5 h-5 text-slate-500" />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800/40">
                <span className="text-xs text-slate-400">Assigned Role</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{profile?.role}</span>
              </div>

              <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-2xl border border-slate-800/40">
                <span className="text-xs text-slate-400">Subscription Expiry</span>
                <span className="text-xs text-slate-300 font-semibold font-sans">
                  {profile?.subscriptionExpiresAt 
                    ? new Date(profile.subscriptionExpiresAt).toLocaleDateString()
                    : "No Expiry Limit"}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned Permissions</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.permissions && profile.permissions.length > 0 ? (
                    profile.permissions.map((perm) => (
                      <span 
                        key={perm}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800 font-mono font-semibold"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No administrative capabilities assigned (Read-only Profile).</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Security Timeline */}
          <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h3 className="text-base font-serif font-bold text-slate-100">Security Activity Log</h3>
              <Activity className="w-5 h-5 text-slate-500" />
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {activity.length > 0 ? (
                activity.map((event, idx) => (
                  <div key={idx} className="flex gap-3 border-l-2 border-slate-900 pl-4 py-1 relative">
                    <div className="absolute -left-[5px] top-2.5 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-950"></div>
                    <div className="space-y-0.5 flex-grow">
                      <p className="text-xs font-semibold text-slate-300">{event.action}</p>
                      <p className="text-[10px] text-slate-500 font-sans">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider self-start ${
                      event.status === "success" ? "text-emerald-500" : "text-rose-500"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500 italic">No recent log entries.</div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
