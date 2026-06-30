"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { dashboardLogger } from "../utils/dashboardLogger";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  widgetName?: string;
}

interface State {
  hasError: boolean;
}

export default class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    dashboardLogger.widgetFailure(
      this.props.widgetName || "Unnamed Widget",
      { message: error.message, stack: error.stack, componentStack: errorInfo.componentStack }
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-rose-950/20 border border-rose-900/40 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 min-h-[180px]">
          <AlertTriangle className="w-8 h-8 text-rose-500 animate-bounce" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-250 font-serif">Widget Diagnostic Error</h4>
            <p className="text-[11px] text-rose-400 font-sans max-w-sm leading-relaxed">
              Clinical telemetry failed to render this segment. An alert has been sent to technical support.
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-1.5 py-1.5 px-4 bg-rose-900 hover:bg-rose-850 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Segment</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
