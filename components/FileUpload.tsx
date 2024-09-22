import { CsvParser } from "@/models/CsvParser";
import React, { ChangeEvent, useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";

type FileUploadProps = {
    onCsvDataChange(updatedCsvData: Record<PropertyKey, string>[]): void;
};

const FileUpload = ({ onCsvDataChange }: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File>();
    const [error, setError] = useState<string | undefined>();
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const file = event.target.files?.[0];
        setError(undefined);
        if (file && file.type === "text/csv") {
            setFile(file);
            handleFile(file);
        } else if (file?.type !== "text/csv") {
            setError(
                "Incorrect file type selected, please select a bank statement CSV file"
            );
        }
    };

    const handleFile = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async event => {
            const csvContent = event.target?.result as string;
            const parser = new CsvParser();
            const parsedCsv = await parser.parseCsvContent(csvContent);
            onCsvDataChange(parsedCsv);
        };

        reader.readAsText(file);
    };

    const handleRemoveFile = () => {
        setFile(undefined);
        onCsvDataChange([]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onDropFile = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        setError(undefined);
        if (droppedFile && droppedFile.type === "text/csv") {
            setFile(droppedFile);
            handleFile(droppedFile);
        } else {
            setError(
                "Incorrect file type selected, please select a bank statement CSV file"
            );
        }
        setIsDragging(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <section
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={onDropFile}
            className={`flex flex-col items-center justify-center h-96
                       w-full rounded-3xl border-dashed border-2 md:max-w-5xl  ${
                           isDragging
                               ? "border-purple-300 border-solid bg-gray-700"
                               : "border-purple-100"
                       }`}
        >
            {isDragging ? (
                <FileUploadIcon className="text-6xl" />
            ) : (
                <>
                    <FileUploadIcon className="text-3xl" />
                    <h1> Drag & drop CSV here</h1>
                    <span>
                        or{" "}
                        <label
                            className="text-purple-200 cursor-pointer  hover:underline "
                            htmlFor="browse"
                        >
                            browse file
                        </label>{" "}
                        from device
                        <input
                            id="browse"
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept=".csv"
                            onChange={handleFileChange}
                        />
                    </span>
                    {file ? (
                        <div className="text-center">
                            {file.name}{" "}
                            <CloseIcon
                                className="text-red-500 cursor-pointer hover:text-red-300"
                                onClick={handleRemoveFile}
                            />
                        </div>
                    ) : (
                        <div>no file selected</div>
                    )}
                    {error ? <p className="text-red-500">{error}</p> : null}
                </>
            )}
        </section>
    );
};

export default FileUpload;
