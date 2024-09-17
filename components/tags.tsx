import React, { useState } from "react";

interface TagsProps {
    onTagsChange: (tags: string[]) => void;
}

export const Tags = ({ onTagsChange }: TagsProps) => {
    const [tags, setTags] = useState<string[]>([]);
    const colourOptions = ["bg-purple-300", "bg-purple-400", "bg-purple-500"];
    const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const newTag = (event.target as HTMLInputElement).value;
            const updatedTags = [...tags, newTag];
            setTags(updatedTags);
            onTagsChange(updatedTags);
            (event.target as HTMLInputElement).value = "";
        }
    };

    const createTag = (tag: string) => {
        return (
            <div
                className={`${
                    colourOptions[
                        Math.floor(Math.random() * colourOptions.length)
                    ]
                } text-white rounded-3xl p-2 h-10 w-max`}
            >
                <p>{tag}</p>
            </div>
        );
    };

    return (
        <>
            <input
                type="text"
                onKeyDown={handleAddTag}
                placeholder="Add key words"
            />
            <div className=" flex items-center justify-center  gap-1  max-w-72">
                {tags.map(tag => createTag(tag))}
            </div>
        </>
    );
};
