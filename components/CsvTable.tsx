import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";
import { useState } from "react";

type CsvTableProps = {
    tableData: Record<PropertyKey, string>[];
};

const CsvTable = ({ tableData }: CsvTableProps) => {
    const [page, setPage] = useState(0); // Start at 0 (zero-indexed for pagination)
    const [take, setTake] = useState(10);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setTake(parseInt(event.target.value, 10));
        setPage(0);
    };

    return tableData.length ? (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {Object.keys(tableData[0]).map((header, i) => (
                                <TableCell key={i}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[...tableData]
                            .slice(page * take, page * take + take)
                            .map((line, i) => (
                                <TableRow key={i}>
                                    {Object.values(line).map((value, j) => (
                                        <TableCell key={j}>{value}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={tableData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={take}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{ color: "white" }}
            />
        </>
    ) : null;
};

export default CsvTable;
