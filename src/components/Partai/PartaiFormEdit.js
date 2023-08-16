import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

//MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// icons
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

const validationSchema = yup.object({
  nomor: yup.string("Masukan Nomor Partai").required("Harus Diisi"),
  partai: yup.string("Masukan Nama Partai").required("Harus Diisi"),
  code_warna: yup.string("Masukan Warna").required("Harus Diisi"),
});

const handleSubmit = (values, setSubmitting, handleClose, refetch) => {
  axios
    .put(`/api/partai/${values.id}`, values)
    .then((res) => {
      toast.success(res.data.message);
      refetch();
      setTimeout(() => {
        handleClose();
      }, 500);
    })
    .catch((err) => {
      const msg = err?.response?.data?.message || "Gagal Proses";
      toast.error(msg);
    })
    .then(() => {
      setSubmitting(false);
    });
};

function PartaiFormEdit({ detail, handleClose, refetch }) {
  const formik = useFormik({
    initialValues: detail
      ? {
          id: detail.id || "",
          nomor: detail?.nomor || "",
          partai: detail?.partai || "",
          code_warna: detail?.code_warna || "#000000",
        }
      : {
          id: "",
          nomor: "",
          partai: "",
          code_warna: "#000000",
        },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, handleClose, refetch),
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Formulir Edit Data Partai</DialogTitle>
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
            type="color"
            label="Warna Identitas"
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
          <Button onClick={handleClose} startIcon={<CancelOutlinedIcon />}>
            Cancel
          </Button>
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            startIcon={<TaskAltOutlinedIcon />}
          >
            {formik.isSubmitting ? "Memproses ..." : "Update"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
}

export default PartaiFormEdit;
