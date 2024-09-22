"use client";

import { Statements } from "@/models/statements/enum/Statements.enum";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import React from "react";

type StatementProps = {
    onStatementChange(updatedStatement: Statements): void;
};

const StatementType = ({ onStatementChange }: StatementProps) => {
    const statementKeys = Object.values(Statements);
    const [statementType, setStatementType] = React.useState<Statements>(
        Statements.NATWEST
    );

    const handleChange = (event: SelectChangeEvent) => {
        setStatementType(event.target.value as Statements);
        onStatementChange(event.target.value as Statements);
    };

    return (
        <FormControl fullWidth>
            <InputLabel
                id="demo-simple-select-label"
                sx={{
                    color: "white",
                    "&.Mui-focused.MuiInputLabel-root": {
                        color: "white",
                    },
                }}
            >
                Bank
            </InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={statementType}
                label="Bank"
                onChange={handleChange}
                sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    ".MuiSvgIcon-root ": {
                        fill: "white !important",
                    },
                    "& .MuiFormLabel-root": {
                        color: "white",
                        paddingRight: "0.2rem",
                        paddingLeft: "0.2rem",
                    },
                }}
            >
                {statementKeys.map((statementType, i) => {
                    return (
                        <MenuItem key={i} value={statementType}>
                            {statementType}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

export default StatementType;
