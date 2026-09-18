import React, { useState } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { StoreClinicalCareView } from "@/features/store-clinical-care/components/StoreClinicalCareView";
import { CareLevelCard } from "@/features/store-clinical-care/components/CareLevelCard";
import { PatientJourneyForm } from "@/features/store-clinical-care/components/PatientJourneyForm";
import type { ClinicalCareDurationWeeks } from "@/features/store-clinical-care/domain/types";

vi.mock("next/link", () => ({ default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a> }));
beforeAll(() => {
  HTMLDialogElement.prototype.close = vi.fn();
  HTMLDialogElement.prototype.showModal = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);
function MembershipComparison() {
  const [tier, setTier] = useState("membership_focused");
  const [weeks, setWeeks] = useState<ClinicalCareDurationWeeks>(4);
  return <CareLevelCard selectedTierId={tier} selectedDurationWeeks={weeks} onSelectTier={setTier} onSelectDuration={setWeeks} />;
}

describe("patient-facing care comparison", () => {
  it("keeps a two-week selection when comparing membership tiers and shows the right allowance", () => {
    render(<MembershipComparison />);
    const members = within(screen.getByRole("region", { name: "Membership Follow-up Plans" }));
    fireEvent.click(members.getByRole("button", { name: /2\s*weeks\s*₹3,000\s*Lower\s*upfront\s*payment/ }));
    expect(screen.getByText("2 weeks of follow-up for one person, including one scheduled consultation. Renewal is optional. Weekly continuity discounts do not apply.")).toBeTruthy();
    fireEvent.click(members.getByRole("button", { name: /^Integrated Membership/ }));
    expect(members.getByRole("button", { name: /2\s*weeks\s*₹6,000\s*Lower\s*upfront\s*payment/ }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.queryByText(/^One calendar month\./)).toBeNull();
    expect(document.body.textContent).not.toMatch(/up to (30|60|75) minutes/);
  });
  it("retains all chronic durations, with no two-week benefit", () => {
    render(<MembershipComparison />);
    const chronic = within(screen.getByRole("region", { name: "Chronic Care" }));
    fireEvent.click(chronic.getByRole("button", { name: /^Advanced Chronic Care/ }));
    fireEvent.click(chronic.getByRole("button", { name: /2\s*weeks\s*₹24,000\s*Standard\s*rate/ }));
    expect(chronic.getByRole("button", { name: /2\s*weeks\s*₹24,000\s*Standard\s*rate/ }).getAttribute("aria-pressed")).toBe("true");
    expect(chronic.getByRole("button", { name: /12\s*weeks\s*₹1,15,200\s*20%\s*continuity\s*benefit\s*₹1,44,000/ })).toBeTruthy();
  });
  it("leads with chronic care while keeping acute care clear for new and walk-in concerns", () => {
    render(<MembershipComparison />);
    expect(screen.getAllByRole("region").map((region) => region.getAttribute("aria-label")).filter(Boolean)).toEqual([
      "Chronic Care",
      "Acute & Subacute Care",
      "Membership Follow-up Plans",
    ]);
    expect(screen.getByText(/practical short starting period for suitable new and walk-in concerns/i)).toBeTruthy();
  });
  it("opens help without selecting a paid plan and preserves membership period in the actual page", () => {
    render(<StoreClinicalCareView />);
    fireEvent.click(screen.getByRole("button", { name: "Help me choose a plan" }));
    expect(screen.getByText("Not sure where to begin? Open the pathway guide").closest("details")?.open).toBe(true);
    const members = within(screen.getByRole("region", { name: "Membership Follow-up Plans" }));
    fireEvent.click(members.getByRole("button", { name: /2\s*weeks\s*₹3,000\s*Lower\s*upfront\s*payment/ }));
    fireEvent.click(members.getByRole("button", { name: /^Comprehensive Membership/ }));
    expect(members.getByRole("button", { name: /2\s*weeks\s*₹12,000\s*Lower\s*upfront\s*payment/ }).getAttribute("aria-pressed")).toBe("true");
  });
  it("does not prefill gender and explains that the patient must send the prepared request", () => {
    render(<PatientJourneyForm onSubmitAssessment={vi.fn()} />);
    expect((screen.getByRole("combobox", { name: "Gender" }) as HTMLSelectElement).value).toBe("");
    expect(screen.getByText(/This form prepares a WhatsApp message/)).toBeTruthy();
  });
  it("keeps entered history in the WhatsApp request and retry link without claiming receipt", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<StoreClinicalCareView />);
    fireEvent.click(screen.getByRole("button", { name: "Request physician review", exact: true }));
    fireEvent.change(screen.getByLabelText("Patient Full Name *"), { target: { value: "Test Patient" } });
    fireEvent.change(screen.getByLabelText("Phone Number (WhatsApp) *"), { target: { value: "9999999999" } });
    fireEvent.change(screen.getByLabelText("Email Address (Optional)"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Next Step/ }));
    fireEvent.change(screen.getByLabelText("Primary Health Area *"), { target: { value: "Test concern" } });
    fireEvent.change(screen.getByLabelText(/Briefly describe/), { target: { value: "Synthetic concern for a local interaction test" } });
    fireEvent.click(screen.getByRole("button", { name: /Next Step/ }));
    fireEvent.change(screen.getByLabelText("How long have you had this concern?"), { target: { value: "A few weeks" } });
    fireEvent.change(screen.getByLabelText("Prior Treatments & Medications"), { target: { value: "Synthetic treatment history" } });
    fireEvent.change(screen.getByLabelText("Relevant Reports or Records (Optional)"), { target: { value: "Synthetic report summary" } });
    fireEvent.click(screen.getByRole("button", { name: /Next Step/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /I acknowledge/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /I confirm/ }));
    fireEvent.click(screen.getByRole("button", { name: /Review & send on WhatsApp/ }));
    expect(open).toHaveBeenCalledOnce();
    const url = String(open.mock.calls[0][0]);
    const message = new URL(url).searchParams.get("text");
    expect(message).toContain("Synthetic treatment history");
    expect(message).toContain("Synthetic report summary");
    expect(message).toContain("test@example.com");
    expect(screen.getByRole("heading", { name: "Your review request is ready" })).toBeTruthy();
    expect(screen.queryByText("Submission Received for Physician Review")).toBeNull();
    expect(screen.getByRole("link", { name: /Continue to Physician Review on WhatsApp/ }).getAttribute("href")).toBe(url);
    open.mockRestore();
  });

});
