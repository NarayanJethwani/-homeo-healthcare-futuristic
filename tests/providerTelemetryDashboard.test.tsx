import React from "react";
import { render, fireEvent, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ObservabilityDashboard from "../src/app/admin/observability/page";

// Mock global window alert/confirm
beforeEach(() => {
  vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
  vi.stubGlobal("alert", vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockHealthResponse = {
  success: true,
  stats: {
    totalRequests: 10,
    failures: 2,
    cacheHits: 4,
    knowledgeHits: 3,
    averageLatencyMs: 1250,
    activeProvider: "Gemini",
    providerHealth: {
      Gemini: "Healthy",
      Ollama: "Offline"
    }
  },
  cache: { type: "local-map", size: 4 },
  logs: []
};

const mockTelemetryResponse = {
  schemaVersion: "1.0.0",
  scope: "instance-local",
  resettable: true,
  readiness: {
    ollama: "Offline"
  },
  providerAttempts: {
    total: 10,
    success: 8,
    failed: 2
  },
  failuresByCategory: {
    provider_timeout: 1,
    provider_rate_limited: 0,
    provider_auth: 0,
    provider_policy: 1,
    provider_unavailable: 0,
    unknown: 0
  },
  latencyBuckets: {
    under_1s: 5,
    "1_to_3s": 3,
    "3_to_5s": 2,
    "5_to_10s": 0,
    over_10s: 0
  },
  embeddings: {
    operations: 15,
    failures: 1
  },
  cache: {
    hits: 4,
    misses: 6
  }
};

describe("ObservabilityDashboard Component", () => {
  it("renders the dashboard page, showing health status and loaded telemetry values", async () => {
    // Mock fetches
    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/ai-router/health")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHealthResponse)
        });
      }
      if (url.includes("/api/admin/observability/provider-metrics")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTelemetryResponse)
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ObservabilityDashboard />);

    // Wait for elements to render
    await waitFor(() => {
      expect(screen.getByText("Lucy Router Analytics")).toBeInTheDocument();
    });

    // Verify warning label exists
    expect(
      screen.getByText(/Telemetry metrics are process-local \(instance-scoped\)\. Resets affect only the current handling instance/i)
    ).toBeInTheDocument();

    // Verify values display correctly
    expect(screen.getByText("Total Attempts")).toBeInTheDocument();
    expect(screen.getAllByText("10").length).toBeGreaterThan(0); // 10 attempts
    expect(screen.getByText("15")).toBeInTheDocument(); // 15 embedding operations
    expect(screen.getAllByText("1").length).toBeGreaterThan(0); // 1 embedding failure
    expect(screen.getByText("Readiness:")).toBeInTheDocument();
  });

  it("handles the reset telemetry metrics flow correctly with verification", async () => {
    let postBody: any = null;
    const fetchMock = vi.fn().mockImplementation((url, init) => {
      if (url.includes("/api/ai-router/health")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHealthResponse)
        });
      }
      if (url.includes("/api/admin/observability/provider-metrics")) {
        if (init && init.method === "POST") {
          postBody = JSON.parse(init.body);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, message: "Reset complete." })
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTelemetryResponse)
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ObservabilityDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Reset Current Instance Metrics")).toBeInTheDocument();
    });

    const resetBtn = screen.getByText("Reset Current Instance Metrics");
    fireEvent.click(resetBtn);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to reset metrics for this instance only? Resets affect only the current handling instance in memory."
    );

    await waitFor(() => {
      expect(postBody).toEqual({ action: "reset" });
      expect(window.alert).toHaveBeenCalledWith("Telemetry metrics successfully reset on this instance.");
    });
  });

  it("aborts reset request early if user cancels prompt", async () => {
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(false)); // user cancels
    const fetchMock = vi.fn().mockImplementation((url) => {
      if (url.includes("/api/ai-router/health")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockHealthResponse)
        });
      }
      if (url.includes("/api/admin/observability/provider-metrics")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTelemetryResponse)
        });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ObservabilityDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Reset Current Instance Metrics")).toBeInTheDocument();
    });

    const resetBtn = screen.getByText("Reset Current Instance Metrics");
    fireEvent.click(resetBtn);

    expect(window.confirm).toHaveBeenCalled();
    // Verify no POST was triggered
    fetchMock.mock.calls.forEach(call => {
      const init = call[1];
      if (init && init.method === "POST") {
        throw new Error("POST was called even when user clicked cancel!");
      }
    });
  });
});
