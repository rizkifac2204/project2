import { Fragment } from "react";

// MUI
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import CalegAksi from "./CalegAksi";

const useStyles = makeStyles((theme) => ({
  thumb: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  table: {
    "& tr": {
      marginBottom: 10,
      borderRadius: 4,
      height: "auto",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    "& .MuiTableHead-root": {
      backgroundColor: "transparent",
    },
    "& .MuiTableCell-head, .MuiTableCell-body": {
      height: "auto",
      padding: "12px 16px",
      lineHeight: 1,
      borderBottom: 0,
      backgroundColor: theme.palette.common.white,
    },
  },
}));

export default function CalegList(props) {
  const classes = useStyles();
  const { calegs, handleDeleteClick } = props;

  return (
    <TableContainer
      component={Paper}
      className={`contact-list-wrap ${classes.paper}`}
    >
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No Urut</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell align="left">Partai</TableCell>
            <TableCell align="left">Dapil</TableCell>
            <TableCell align="left">Jenis Kelamin</TableCell>
            <TableCell align="left">Alamat</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {calegs?.pages.map((group, i) => (
            <Fragment key={i}>
              {group.data.map((caleg, index) => (
                <TableRow key={index}>
                  <TableCell>{caleg.nomor_urut}</TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" color="primary">
                      {caleg.nama}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">{caleg?.partai || "-"}</TableCell>
                  <TableCell align="left">{caleg?.dapil || "-"}</TableCell>
                  <TableCell align="left">
                    {caleg?.jenis_kelamin || "-"}
                  </TableCell>
                  <TableCell align="left">{caleg?.alamat || `-`}</TableCell>
                  <TableCell align="left">
                    <CalegAksi
                      caleg={caleg}
                      handleDeleteClick={handleDeleteClick}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
