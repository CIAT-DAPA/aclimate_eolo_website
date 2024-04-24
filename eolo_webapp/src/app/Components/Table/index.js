import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./table.module.css"


const CsvTable = ({ titles, data }) => {

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {titles.map((col, index) => {
              if (index === 0) {
                return <TableCell key={col} className={styles.columns}>{col}</TableCell>;
              } else {
                return <TableCell key={col} className={styles.columns} align="right">{col}</TableCell>;
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.above}</TableCell>
              <TableCell align="right">{row.normal}</TableCell>
              <TableCell align="right">{row.below}</TableCell>
              <TableCell align="right">{row.htp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CsvTable;
