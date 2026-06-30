/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import CriticalAlertsPanel from "../components/CriticalAlertsPanel";

describe("CriticalAlertsPanel Component", () => {
  it("renders alerts list correctly", () => {
    render(
      <CriticalAlertsPanel
        patients={[]}
        onSelectPatient={() => {}}
        setActiveTab={() => {}}
      />
    );

    expect(screen.getByText("Critical Alarms & Bio-Telemetry")).toBeInTheDocument();
  });
});
