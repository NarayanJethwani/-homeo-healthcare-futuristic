/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import PatientQueue from "../components/PatientQueue";

describe("PatientQueue Component", () => {
  it("renders patient queue headers correctly", () => {
    const mockPatients = [
      {
        id: "mock-1",
        name: "Rahul Sharma",
        age: "34",
        gender: "Male",
        complaint: "Chronic asthma",
        careLevel: "high",
        status: "active",
        createdAt: "2026-06-30"
      }
    ];

    // Minimal render verification
    render(
      <PatientQueue 
        patients={mockPatients as any}
        onSelectPatient={() => {}}
        setActiveTab={() => {}}
      />
    );

    expect(screen.getByText("Active Patient Intake Queue")).toBeInTheDocument();
  });
});
