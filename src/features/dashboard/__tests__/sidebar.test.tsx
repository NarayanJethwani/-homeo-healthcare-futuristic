/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminSidebar from "../components/AdminSidebar";

describe("AdminSidebar Component", () => {
  it("renders sidebar sections properly", () => {
    render(
      <AdminSidebar
        isCollapsed={false}
        setIsCollapsed={() => {}}
        activeTab="dashboard"
        setActiveTab={() => {}}
        favorites={[]}
        setFavorites={() => {}}
        handleSubTabClick={() => {}}
        onOpenConsultation={() => {}}
        session={null}
      />
    );

    expect(screen.getByText("Clinical OS")).toBeInTheDocument();
  });
});
