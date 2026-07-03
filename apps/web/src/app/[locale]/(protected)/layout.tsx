"use client";

import { type PropsWithChildren } from "react";

import Header from "@/widgets/Header";

export default function DashboardLayout({
    children,
}: Readonly<PropsWithChildren>) {
    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            <Header />
            {children}
        </div>
    );
}
