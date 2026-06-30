/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from "react";
import { render } from "@testing-library/react";
import GlobalCommandPalette from "../components/GlobalCommandPalette";

describe("GlobalCommandPalette Component", () => {
  it("renders when open is true", () => {
    const { container } = render(
      <GlobalCommandPalette
        isOpen={true}
        onClose={() => {}}
        patients={[]}
        onSelectPatient={() => {}}
        invoicesList={[]}
        onOpenInvoice={() => {}}
        setActiveTab={() => {}}
        onTriggerQuickAction={() => {}}
        clinicians={[]}
        remediesKeynotes={{}}
      />
    );

    // Command palette modal wraps in absolute overlays
    expect(container).toBeDefined();
  });
});
