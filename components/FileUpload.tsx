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
        if (
            file
            // && file.type === "text/csv"
        ) {
            setFile(file);
            handleFile(file);
        }
        // else if (file?.type !== "text/csv") {
        //     setError(
        //         "Incorrect file type selected, please select a bank statement CSV file"
        //     );
        // }
    };

    const handleFile = async (file: File) => {
        console.log(file);
        // file is an object of meta data and a pointer to the actual location of the file
        // on the user's desktop.
        const reader = new FileReader();

        // create a snapshot by reading the file into an Array Buffer
        /** ArrayBuffer is a block of memory containing the file's data in byte form
         * it is fixed in length
         * this is async in nature, reading the bytes and storing them in the array buffer
         */
        reader.readAsArrayBuffer(file);

        /** onload is triggered when reading operation completes
         * note onload is not a stream it will load the entire ArrayBuffer (AB) thus AB
         * have size constraints to prevent freezing
         */
        reader.onload = event => {
            const arrayBuffer = event.target?.result;
            console.log("arrayBuffer:", arrayBuffer);
            if (arrayBuffer) {
                /** Uint8Array creates context for the arrayBuffer  */
                const uint8Array = new Uint8Array(arrayBuffer as ArrayBuffer);
                console.log("uint8Array:", uint8Array);
                parsePdf(uint8Array);
            }
        };
        // reader.onload = async event => {
        //     const csvContent = event.target?.result as string;
        //     const parser = new CsvParser();
        //     const parsedCsv = await parser.parseCsvContent(csvContent);
        //     onCsvDataChange(parsedCsv);
        // };

        // reader.readAsText(file);
    };

    const parsePdf = (uint8Array: Uint8Array) => {
        const decoded = Utf8ArrayToStr(uint8Array);
        for (let i = 0; i < decoded.length; i++) {
            hexToUtf8(decoded[i]);
        }
        // let pdfText = "";
        // for (let i = 0; i < uint8Array.length; i++) {
        //     pdfText += String.fromCharCode(uint8Array[i]);
        // }
    };

    function Utf8ArrayToStr(array: any) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(
                        ((c & 0x1f) << 6) | (char2 & 0x3f)
                    );
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(
                        ((c & 0x0f) << 12) |
                            ((char2 & 0x3f) << 6) |
                            ((char3 & 0x3f) << 0)
                    );
                    break;
            }
        }

        return out;
    }

    function hexToUtf8(hex: string): string {
        let result = "";
        // Remove the surrounding '<' and '>' if they exist
        hex = hex.replace(/[<>]/g, "");

        // Decode each pair of hex characters into its character representation
        for (let i = 0; i < hex.length; i += 2) {
            const byte = parseInt(hex.substr(i, 2), 16);
            result += String.fromCharCode(byte);
        }
        if (result.length) console.log(result);
        return result;
    }

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
                       w-full  rounded-3xl border-dashed border-2 md:max-w-xl md:mb-6  ${
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
                            accept=".pdf"
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
