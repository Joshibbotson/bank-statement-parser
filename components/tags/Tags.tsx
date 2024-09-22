"use client";

import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";
import { defaultTags } from "./defaultTags";

export type Tag = {
    description: string;
    colour: string;
};
export interface TagsProps {
    onTagsChange: (tags: Tag[]) => void;
}

export const Tags = ({ onTagsChange }: TagsProps) => {
    const colourOptions = ["bg-purple-300", "bg-purple-400", "bg-purple-500"];

    const [tags, setTags] = useState<Tag[]>(defaultTags);
    const [error, setError] = useState<string>("");

    const containsDuplicate = (word: string): boolean => {
        return tags.some(tag => tag.description === word);
    };
    const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const description = (event.target as HTMLInputElement).value;
        if (event.key === "Enter") {
            if (containsDuplicate(description)) {
                setError("Tag already exists");
                return;
            }
            const newTag: Tag = {
                description,
                colour: colourOptions[
                    Math.floor(Math.random() * colourOptions.length)
                ],
            };
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
            onTagsChange(updatedTags);
            setError("");
            (event.target as HTMLInputElement).value = "";
        }
    };

    function handleRemoveTag(i: number): void {
        const updatedTags = [...tags];
        updatedTags.splice(i, 1);
        setTags(updatedTags);
        onTagsChange(updatedTags);
    }

    const createTag = (tag: Tag, i: number) => {
        return (
            <div
                className={`${tag.colour} text-white rounded-3xl p-2 h-10 w-max flex justify-center items-center`}
                key={i}
            >
                <p>{tag.description}</p>
                <CloseIcon
                    onClick={() => handleRemoveTag(i)}
                    className="text-base text-white cursor-pointer hover:text-red-300"
                />
            </div>
        );
    };

    return (
        <>
            <TextField
                id="outlined-basic"
                variant="outlined"
                label="Tags"
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "white",
                        },
                        "&:hover fieldset": {
                            borderColor: "white",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "white",
                        },
                        "& input": {
                            color: "white",
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "white",
                        paddingRight: "0.2rem",
                        paddingLeft: "0.2rem",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "white",
                    },
                }}
                onKeyDown={handleAddTag}
                placeholder="Add key words to check"
            />
            <p className="text-red-700">{error}</p>

            <div
                className={`overflow-auto flex flex-wrap items-center justify-center gap-1 max-w-72 ${
                    tags.length > 0 ? " md:max-h-64 max-h-24" : "max-h-10"
                }`}
            >
                {tags.map((tag, i) => createTag(tag, i))}
            </div>
        </>
    );
};
