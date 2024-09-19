"use client";

import { CsvParser } from "@/models/CsvParser";
import { Statements } from "@/models/statements/enum/Statements.enum";
import { StatementFactory } from "@/models/statements/StatementFactory";
import { ChangeEvent, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Tag, Tags } from "@/components/tags";
import Nav from "@/components/Nav";
import TotalSpentCard from "@/components/TotalSpentCard";

export default function Home() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File>();
    const [csvData, setCsvData] = useState<Record<PropertyKey, string>[]>([]);
    const [statementValue, setStatementValue] = useState<number>();
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [error, setError] = useState<string | undefined>();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [tags, setTags] = useState<Tag[]>([]);

    const handleTagsUpdate = (updatedTags: Tag[]) => {
        setTags(updatedTags);
    };

    const handleFileChange = async (
        event: ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const file = event.target.files?.[0];
        console.log(file);
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
            setCsvData(parsedCsv);
        };

        reader.readAsText(file);
        console.timeEnd("parse");
    };

    const handleRemoveFile = () => {
        setFile(undefined);
        setCsvData([]);
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

    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate !== null) {
            setSelectedDate(newDate);
        }
    };

    const handleClick = async () => {
        console.time("result");
        const result = await StatementFactory.getShoppingResults(
            csvData,
            Statements.NATWEST,
            selectedDate,
            tags.length ? tags.map(tag => tag.description) : undefined
        );
        console.timeEnd("result");
        setStatementValue(result);
    };

    return (
        <>
            <Nav />
            <main className="flex flex-col items-center justify-center w-full h-screen">
                <div className="flex flex-col items-center justify-center w-full p-10">
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
                                    <div>
                                        {file.name}{" "}
                                        <CloseIcon
                                            className="text-red-500 cursor-pointer hover:text-red-300"
                                            onClick={handleRemoveFile}
                                        />
                                    </div>
                                ) : (
                                    <div>no file selected</div>
                                )}
                                {error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : null}
                            </>
                        )}
                    </section>
                    <div className="flex mt-4 gap-3">
                        <div className="flex flex-col gap-3">
                            {/* <StatementType /> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    defaultValue={dayjs()}
                                    label={"Month and Year "}
                                    views={["month", "year"]}
                                    onChange={handleDateChange}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                borderColor: "white",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "blue",
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "white",
                                            },
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "white",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "white",
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "white",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "white",
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <Tags onTagsChange={handleTagsUpdate} />
                        </div>
                        <div className="flex flex-col gap-6">
                            <TotalSpentCard
                                selectedDate={selectedDate}
                                statementValue={statementValue}
                            />
                            <Button
                                sx={{
                                    backgroundColor: !file ? "grey" : "lilac",
                                    color: !file ? "white" : "black",
                                    "&:hover": {
                                        backgroundColor: !file
                                            ? "grey"
                                            : "white",
                                    },
                                    "&.Mui-disabled": {
                                        backgroundColor: "grey",
                                        color: "white",
                                    },
                                }}
                                variant="contained"
                                onClick={handleClick}
                                disabled={!file}
                            >
                                check monthly spend
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
