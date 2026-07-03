"use client";

import { useEffect, useState } from "react";
import { DocumentDto } from "@app/shared";

import { getDocuments, uploadDocument } from "@/lib/api";

import DropFile from "./DropFile";
import RecentDocuments from "./RecentDocuments";

export default function HomeScreen() {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [documents, setDocuments] = useState<DocumentDto[]>([]);

    function handleFile(file: File) {
        setIsUploading(true);
        uploadDocument(file).finally(() => setIsUploading(false));
    }

    useEffect(() => {
        getDocuments().then(setDocuments);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-6 bg-white">
            <div className="w-full max-w-120">
                <DropFile isUploading={isUploading} onFileSubmit={handleFile} />

                <RecentDocuments documents={documents} />
            </div>
        </div>
    );
}
