import { ChevronRightIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { DocumentDto, DocumentStatus } from "@app/shared";
import { formatDocumentDate } from "@/lib/formatDate";
import { cn } from "@/lib/cn";

export const DOCUMENT_STATUS_COLORS = {
    [DocumentStatus.UPLOADED]: "bg-gray-100 text-gray-700",
    [DocumentStatus.PROCESSING]: "bg-blue-100 text-blue-700",
    [DocumentStatus.COMPLETED]: "bg-green-100 text-green-700",
    [DocumentStatus.FAILED]: "bg-red-100 text-red-700",
} as const;

interface Props {
    documents: DocumentDto[];
}

export default function RecentDocuments(props: Props) {
    const t = useTranslations();

    return (
        <div className="mt-8">
            <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
                Recent
            </p>
            <div className="flex flex-col gap-1">
                {props.documents.map((document) => (
                    <Link
                        key={document.originalName}
                        href={`/document/${document.id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FA] transition-colors text-left group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                            <FileTextIcon className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-[#111111] truncate">
                                {document.originalName}
                            </p>
                            <p className="text-[12px] text-[#9CA3AF]">
                                {formatDocumentDate(
                                    document.createdAt,
                                    "en-US",
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span
                                className={cn(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                    DOCUMENT_STATUS_COLORS[document.status],
                                )}
                            >
                                {t(`Document.status.${document.status}`)}
                            </span>
                            <ChevronRightIcon className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#4F7CFF] transition-colors" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
