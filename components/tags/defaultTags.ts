import { Tag } from "./Tags";

const colourOptions = ["bg-purple-300", "bg-purple-400", "bg-purple-500"];

export const defaultTags: Tag[] = [
    {
        description: "tesco stores",
        colour: colourOptions[Math.floor(Math.random() * colourOptions.length)],
    },
    {
        description: "morrisons",
        colour: colourOptions[Math.floor(Math.random() * colourOptions.length)],
    },
    {
        description: "asda stores",
        colour: colourOptions[Math.floor(Math.random() * colourOptions.length)],
    },
    {
        description: "sainsbury's",
        colour: colourOptions[Math.floor(Math.random() * colourOptions.length)],
    },
];
