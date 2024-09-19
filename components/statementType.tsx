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

const StatementType = () => {
    const statementKeys = Object.keys(Statements);
    const [statementType, setStatementType] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setStatementType(event.target.value as string);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Bank</InputLabel>
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
                        color: "white", // White label text
                        paddingRight: "0.2rem", // Adjust padding for label overlap
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
