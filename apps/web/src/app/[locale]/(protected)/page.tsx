"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";

import { uploadDocument } from "@/lib/api";

import DropFile from "./DropFile";

export default function HomeScreen() {
    const [isUploading, setIsUploading] = useState(false);

    const recent = [
        { name: "Q4 Investment Agreement.pdf", date: "2 hours ago" },
        { name: "Merger Term Sheet.pdf", date: "Yesterday" },
        { name: "Employment Contract.pdf", date: "3 days ago" },
    ];

    function handleFile(file: File) {
        setIsUploading(true);
        uploadDocument(file).finally(() => setIsUploading(false));
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-white">
            <div className="w-full max-w-120">
                {/* Drop zone */}
                <DropFile isUploading={isUploading} onFileSubmit={handleFile} />

                {/* Recent */}
                {recent.length > 0 && (
                    <div className="mt-8">
                        <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                            Recent
                        </p>
                        <div className="flex flex-col gap-1">
                            {recent.map((doc) => (
                                <Link
                                    key={doc.name}
                                    href="/document/123"
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FA] transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-[#9CA3AF]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-[#111111] truncate">
                                            {doc.name}
                                        </p>
                                        <p className="text-[12px] text-[#9CA3AF]">
                                            {doc.date}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#4F7CFF] transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
