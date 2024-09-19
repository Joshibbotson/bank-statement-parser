"use client";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Dayjs } from "dayjs";

type TotalSpendCardProps = {
    selectedDate: Dayjs;
    statementValue?: number;
};

const TotalSpentCard = ({
    selectedDate,
    statementValue,
}: TotalSpendCardProps) => (
    <div className="flex flex-col justify-between bg-slate-200 text-black rounded w-72 h-32 p-3">
        <span className="flex justify-between">
            <h3 className="font-semibold">Total spent</h3>
            <Tooltip title={`Total spent on ${selectedDate.format("MM/YYYY")}`}>
                <InfoIcon />
            </Tooltip>
        </span>
        <h1 className="text-5xl	">£{statementValue?.toFixed(2)}</h1>
    </div>
);

export default TotalSpentCard;
