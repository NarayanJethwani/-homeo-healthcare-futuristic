"use client";

import { useEffect, useState } from "react";
import { Activity, ShieldAlert, Cpu, Database, RefreshCw, Terminal, CheckCircle2, AlertTriangle, XCircle, Search } from "lucide-react";

interface Stats {
  totalRequests: number;
  failures: number;
  cacheHits: number;
  knowledgeHits: number;
  retries: number;
  fallbacks: number;
  averageLatencyMs: number;
  activeProvider: string;
  providerHealth: Record<string, "Healthy" | "Degraded" | "Offline">;
}

interface RequestLog {
  timestamp: string;
  query: string;
  category: string;
  provider: string;
  model: string;
  latencyMs: number;
  status: "Success" | "Failed";
  retries: number;
  cacheHit: boolean;
  knowledgeHit: boolean;
}

interface HealthData {
  success: boolean;
  stats: Stats;
  cache: { type: string; size: number };
  logs: RequestLog[];
}

export default function ObservabilityDashboard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testQuery, setTestQuery] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/ai-router/health");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load observability stats:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealth();
  };

  const handleTestConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;
    setTesting(true);
    setTestResponse(null);

    try {
      const startTime = Date.now();
      const res = await fetch("/api/consult-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: testQuery,
          mode: "public",
          lang: "en"
        })
      });
      const json = await res.json();
      const duration = Date.now() - startTime;
      
      setTestResponse(
        `[${json.providerUsed} - ${json.modelUsed}] (Response in ${(duration / 1000).toFixed(2)}s):\n\n${json.response}`
      );
      fetchHealth(); // refresh stats after testing
    } catch {
      setTestResponse(`Error: Failed to fetch AI consultation.`);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-zinc-100 flex flex-col items-center justify-center font-sans p-6">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 text-emerald-500 animate-spin" />
          <p className="text-zinc-400 font-mono tracking-widest text-sm uppercase">Loading Router Observability Dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const cacheHitRate = stats && stats.totalRequests > 0 
    ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(1) 
    : "0.0";
  const ragHitRate = stats && stats.totalRequests > 0 
    ? ((stats.knowledgeHits / stats.totalRequests) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="min-h-screen bg-[#070908] text-zinc-100 font-sans p-6 lg:p-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/50 pb-8 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Lucy Router Analytics
            </h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Production-Grade Hybrid AI Gateway & Fallback Monitor
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 active:scale-95 text-zinc-300 rounded-lg text-sm font-medium transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-emerald-500" : ""}`} />
          {refreshing ? "Refreshing..." : "Force Refresh"}
        </button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: KPI Stats & Providers Health */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Active Provider</span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-zinc-100 truncate">{stats?.activeProvider || "Gemini"}</p>
              <p className="text-xs text-emerald-500 font-mono mt-1">Live Primary Node</p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Avg Latency</span>
                <Cpu className="h-4 w-4 text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-100">{stats?.averageLatencyMs || 0}<span className="text-xs text-zinc-500 ml-1">ms</span></p>
              <p className="text-xs text-zinc-400 font-mono mt-1">Goal: &lt;2000ms</p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">Cache Hit Rate</span>
                <Database className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-100">{cacheHitRate}%</p>
              <p className="text-xs text-zinc-400 font-mono mt-1">{data?.cache.size || 0} cached items ({data?.cache.type})</p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 backdrop-blur-md">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider">RAG Hit Rate</span>
                <Search className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-100">{ragHitRate}%</p>
              <p className="text-xs text-indigo-400 font-mono mt-1">Direct KB Answers</p>
            </div>
          </div>

          {/* Providers Status */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-emerald-500" />
              Provider Topology Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats && Object.entries(stats.providerHealth).map(([pName, status]) => {
                let badge = null;
                if (status === "Healthy") {
                  badge = <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/50 rounded-full"><CheckCircle2 className="h-3 w-3" /> Online</span>;
                } else if (status === "Degraded") {
                  badge = <span className="flex items-center gap-1 text-yellow-400 text-xs font-mono bg-yellow-950/40 px-2 py-0.5 border border-yellow-900/50 rounded-full"><AlertTriangle className="h-3 w-3" /> Degraded</span>;
                } else {
                  badge = <span className="flex items-center gap-1 text-red-400 text-xs font-mono bg-red-950/40 px-2 py-0.5 border border-red-900/50 rounded-full"><XCircle className="h-3 w-3" /> Offline</span>;
                }

                return (
                  <div key={pName} className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-200">{pName}</span>
                      {badge}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {pName === "Ollama" ? "Local Model Backup" : "Cloud API Connection"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal Logs View */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 font-mono text-xs flex flex-col gap-4">
            <h2 className="text-zinc-300 font-semibold flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Terminal className="h-4 w-4 text-emerald-500" />
              Live Gateway Request Feed (Recent Logs)
            </h2>
            <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2 divide-y divide-zinc-900 pr-2">
              {data?.logs && data.logs.length > 0 ? (
                data.logs.map((log, i) => (
                  <div key={i} className="pt-2 flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className="text-zinc-300 font-medium">"{log.query}"</span>
                      <div className="flex gap-3 text-[10px] text-zinc-400">
                        <span>Provider: <strong className="text-zinc-200">{log.provider}</strong></span>
                        <span>Model: <strong className="text-zinc-200">{log.model}</strong></span>
                        <span>Latency: <strong className="text-zinc-200">{log.latencyMs}ms</strong></span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.status === "Success" ? "bg-emerald-950/40 text-emerald-400" : "bg-red-950/40 text-red-400"}`}>
                        {log.status}
                      </span>
                      {log.cacheHit && <span className="text-[10px] text-cyan-400">Cache Hit</span>}
                      {log.knowledgeHit && <span className="text-[10px] text-indigo-400">KB Hit</span>}
                      {log.retries > 0 && <span className="text-[10px] text-yellow-400">Retries: {log.retries}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-zinc-600 text-center py-6">No requests routed yet. Gateway is listening...</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Test Playground & Summary Statistics */}
        <div className="flex flex-col gap-8">
          
          {/* Detailed Request Stats */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-emerald-500" />
              Traffic Statistics
            </h2>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-400">Total Queries Routed</span>
                <span className="font-mono font-bold text-zinc-200">{stats?.totalRequests || 0}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-400">Failed Queries</span>
                <span className="font-mono font-bold text-red-400">{stats?.failures || 0}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/40 pb-2">
                <span className="text-zinc-400">Dynamic Failovers</span>
                <span className="font-mono font-bold text-yellow-400">{stats?.fallbacks || 0}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-zinc-400">Accumulated Retries</span>
                <span className="font-mono font-bold text-zinc-200">{stats?.retries || 0}</span>
              </div>
            </div>
          </div>

          {/* Router Playground */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-6 backdrop-blur-md flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-500" />
              Gateway Sandbox
            </h2>
            <p className="text-xs text-zinc-400">
              Test the AI Router failover directly. Send queries to check routing, cache status, and local model logic.
            </p>
            <form onSubmit={handleTestConsult} className="flex flex-col gap-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Ask Lucy something..."
                className="px-3 py-2 bg-zinc-950 border border-zinc-850 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 placeholder-zinc-600"
              />
              <button
                type="submit"
                disabled={testing || !testQuery.trim()}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Routing query...
                  </>
                ) : (
                  "Submit Query"
                )}
              </button>
            </form>
            {testResponse && (
              <div className="bg-zinc-950/80 border border-zinc-900 rounded-lg p-4 font-mono text-[10px] text-zinc-300 max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {testResponse}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
