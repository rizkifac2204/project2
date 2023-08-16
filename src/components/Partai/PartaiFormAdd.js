import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

//MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// icons
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

const validationSchema = yup.object({
  nomor: yup.string("Masukan Nomor Partai").required("Harus Diisi"),
  partai: yup.string("Masukan Nama Partai").required("Harus Diisi"),
  code_warna: yup.string("Masukan Warna").required("Harus Diisi"),
});

const handleSubmit = (values, setSubmitting, handleClose, queryClient) => {
  axios
    .post(`/api/partai`, values)
    .then((res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["partais"]);
      setTimeout(() => {
        handleClose();
      }, 500);
    })
    .catch((err) => {
      console.log(err);
      const msg = err.response.data.message
        ? err.response.data.message
        : "Gagal Proses";
      toast.error(msg);
    })
    .then(() => {
      setSubmitting(false);
    });
};

function PartaiFormAdd() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      nomor: "",
      partai: "",
      code_warna: "#000000",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, handleClose, queryClient),
  });

  function handleClickOpen() {
    setOpen(true);
  }
  function handleClose() {
    formik.resetForm();
    setOpen(false);
  }

  return (
    <>
      <Button
        startIcon={<AddOutlinedIcon />}
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
        sx={{ mb: 2 }}
      >
        Tambah Data Partai
      </Button>
      <Dialog open={open} onClose={() => handleClose()}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Formulir Tambah Data Partai</DialogTitle>
          <DialogContent>
            <TextField
              sx={{ mb: 3 }}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              label="Nomor"
              fullWidth
              required
              variant="standard"
              name="nomor"
              value={formik.values.nomor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nomor && Boolean(formik.errors.nomor)}
              helperText={formik.touched.nomor && formik.errors.nomor}
            />

            <TextField
              sx={{ mb: 3 }}
              label="Partai"
              fullWidth
              required
              variant="standard"
              name="partai"
              value={formik.values.partai}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.partai && Boolean(formik.errors.partai)}
              helperText={formik.touched.partai && formik.errors.partai}
            />

            <TextField
              sx={{ mb: 3 }}
              label="Warna Identitas"
              type="color"
              fullWidth
              required
              variant="standard"
              name="code_warna"
              value={formik.values.code_warna}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.code_warna && Boolean(formik.errors.code_warna)
              }
              helperText={formik.touched.code_warna && formik.errors.code_warna}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleClose()}
              startIcon={<CancelOutlinedIcon />}
            >
              Cancel
            </Button>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              startIcon={<TaskAltOutlinedIcon />}
            >
              {formik.isSubmitting ? "Memproses ..." : "Simpan"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default PartaiFormAdd;
