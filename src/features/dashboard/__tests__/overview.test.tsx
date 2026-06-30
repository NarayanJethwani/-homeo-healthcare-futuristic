/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import TodayOverviewStats from "../components/TodayOverviewStats";

describe("TodayOverviewStats Component", () => {
  it("renders metrics indicators", () => {
    const mockStats = {
      appointmentsCount: 4,
      followUpsCount: 3,
      abnormalReportsCount: 2,
      emergencyCasesCount: 1,
      revenueCollected: 18400,
      recoveryIndex: "94.2%"
    };

    render(
      <TodayOverviewStats
        stats={mockStats}
      />
    );

    expect(screen.getByText("94.2%")).toBeInTheDocument();
  });
});
