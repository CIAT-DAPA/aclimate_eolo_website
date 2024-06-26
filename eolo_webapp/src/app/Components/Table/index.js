import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./table.module.css";

const CsvTable = ({ titles, subTitles, data, filter, analogues = true }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow className={styles.title_row}>
            {titles.map((col, index) => {
              if (index === 0) {
                return (
                  <TableCell
                    variant="head"
                    key={`${col}_${index}`}
                    className={styles.columns}
                    colSpan={2}
                  >
                    {col}
                  </TableCell>
                );
              } else {
                return (
                  <TableCell
                    key={`${col}_${index}`}
                    className={styles.columns}
                    align="right"
                    colSpan={3}
                    variant="head"
                  >
                    {col}
                  </TableCell>
                );
              }
            })}
          </TableRow>
          {subTitles && (
            <TableRow>
              <TableCell className={styles.subcolumn} colSpan={2}>
                {""}
              </TableCell>
              {subTitles.map((col) => (
                <TableCell key={col} className={styles.subcolumn}>
                  {col}
                </TableCell>
              ))}
              {analogues &&
                subTitles.map((col) => (
                  <TableCell key={col} className={styles.subcolumn}>
                    {col}
                  </TableCell>
                ))}
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {data &&
            Object.keys(data).length > 0 &&
            Object.keys(data).map((row, index) => (
              <TableRow
                key={row}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {filter && filter.length > 0 && filter.includes(row) ? (
                  <>
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={2}
                      className={styles.first_col}
                      key={row}
                    >
                      {row}
                    </TableCell>
                    {Object.keys(data[row]).map((season) =>
                      Object.keys(data[row][season]).map((store) => (
                        <TableCell key={season + store} align="center">
                          {data[row][season][store] == NaN ||
                          data[row][season][store] == "NaN"
                            ? "Sin datos"
                            : Math.round(data[row][season][store])}
                        </TableCell>
                      ))
                    )}
                  </>
                ) : filter && filter.length > 0 && !filter.includes(row) ? (
                  <></>
                ) : (
                  <>
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={2}
                      className={styles.first_col}
                      key={`cell_${row}_${index}`}
                    >
                      {row}
                    </TableCell>
                    {Object.keys(data[row]).map((season) => (
                      <>
                        <TableCell
                          key={row + season + "above" + index}
                          align="center"
                        >
                          {data[row][season]["above"] == NaN ||
                          data[row][season]["above"] == "NaN"
                            ? "Sin datos"
                            : Math.round(data[row][season]["above"])}
                        </TableCell>
                        {analogues && (
                          <>
                            <TableCell
                              key={row + season + "normal" + index}
                              align="center"
                            >
                              {data[row][season]["normal"] == NaN ||
                              data[row][season]["normal"] == "NaN"
                                ? "Sin datos"
                                : Math.round(data[row][season]["normal"])}
                            </TableCell>
                            <TableCell
                              key={row + season + "below" + index}
                              align="center"
                            >
                              {data[row][season]["below"] == NaN ||
                              data[row][season]["below"] == "NaN"
                                ? "Sin datos"
                                : Math.round(data[row][season]["below"])}
                            </TableCell>
                          </>
                        )}
                      </>
                    ))}
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CsvTable;
