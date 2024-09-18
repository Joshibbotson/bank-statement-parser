import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextField } from "@mui/material";

export type Tag = {
    description: string;
    colour: string;
};
export interface TagsProps {
    onTagsChange: (tags: Tag[]) => void;
}

export const Tags = ({ onTagsChange }: TagsProps) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const colourOptions = ["bg-purple-300", "bg-purple-400", "bg-purple-500"];

    const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const newTag: Tag = {
                description: (event.target as HTMLInputElement).value,
                colour: colourOptions[
                    Math.floor(Math.random() * colourOptions.length)
                ],
            };
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
            onTagsChange(updatedTags);
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
                    className=" text-base text-white cursor-pointer hover:text-red-300"
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
                            borderColor: "white", // White border
                        },
                        "&:hover fieldset": {
                            borderColor: "white", // White border on hover
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "white", // White border when focused
                        },
                        "& input": {
                            color: "white", // White text color for input
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "white", // White label text
                        paddingRight: "0.2rem", // Adjust padding for label overlap
                        paddingLeft: "0.2rem",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "white", // White label text when focused
                    },
                }}
                onKeyDown={handleAddTag}
                placeholder="Add key words to check"
            />

            <div className=" flex flex-wrap items-center justify-center  gap-1  max-w-72 h-auto">
                {tags.map((tag, i) => createTag(tag, i))}
            </div>
        </>
    );
};
