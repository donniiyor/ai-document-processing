import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface Props {
    isUploading: boolean;
    onFileSubmit: (file: File) => void;
}

export default function DropFile(props: Props) {
    const [dragging, setDragging] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) props.onFileSubmit(file);
            }}
            onClick={() => !props.isUploading && inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer py-16 px-8
                        ${dragging ? "border-[#4F7CFF] bg-[#EEF2FF]" : "border-[#E5E7EB] hover:border-[#4F7CFF]/50 hover:bg-[#FAFAFA]"}
                        ${props.isUploading ? "pointer-events-none" : ""}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) props.onFileSubmit(f);
                }}
            />

            {props.isUploading ? (
                <>
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-[#4F7CFF] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-[14px] text-[#6B7280]">Uploading...</p>
                </>
            ) : (
                <>
                    <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-[#4F7CFF]" : "bg-[#F3F4F6]"}`}
                    >
                        <Upload
                            className={`w-5 h-5 transition-colors ${dragging ? "text-white" : "text-[#6B7280]"}`}
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-[15px] font-medium text-[#111111]">
                            Drop a file or click to browse
                        </p>
                        <p className="text-[13px] text-[#9CA3AF] mt-1">
                            PDF, DOCX, or TXT · up to 50 MB
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
