import { Fragment } from "react";

// MUI
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import CalegAksi from "./CalegAksi";

export default function CalegList(props) {
  const { calegs, handleDeleteClick } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
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
