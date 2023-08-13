import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
// MUI
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
// components
import ContentLayout from "components/GlobalComponents/ContentLayout";

const validationSchema = yup.object({
  baru: yup.string().required("Password Baru Harus Diisi"),
  passwordConfirm: yup
    .string()
    .required("Konfirmasi Password Harus Diisi")
    .oneOf([yup.ref("baru"), null], "Passwords tidak sama"),
});

const handleSubmit = (values, setSubmitting, user) => {
  const toastProses = toast.loading("Tunggu Sebentar...", { autoClose: false });
  axios
    .put(`/api/user-tps/${user.id}/gantiPassword`, values)
    .then((res) => {
      toast.update(toastProses, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
      let tempMassage = "Gagal Proses";
      if (err.response.status == 404) {
        tempMassage =
          "Mohon Maaf, Hilangkan atau ganti spesial karakter pada inputan anda";
      }
      const msg = err.response.data.message
        ? err.response.data.message
        : tempMassage;
      toast.update(toastProses, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .then(() => {
      setSubmitting(false);
    });
};

function UserTPSFormPassword({ user }) {
  const formik = useFormik({
    initialValues: { baru: "", passwordConfirm: "" },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, user),
  });

  return (
    <div className="hk-general-settings">
      <form onSubmit={formik.handleSubmit}>
        {/* input baru */}
        <Box mb={3}>
          <ContentLayout title="Password Baru *">
            <FormControl fullWidth>
              <TextField
                required
                type="password"
                variant="standard"
                name="baru"
                placeholder="Password Baru"
                value={formik.values.baru}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.baru && Boolean(formik.errors.baru)}
                helperText={formik.touched.baru && formik.errors.baru}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input konfirmasi  */}
        <Box mb={3}>
          <ContentLayout title="Konfimasi Password Baru *">
            <FormControl fullWidth>
              <TextField
                required
                variant="standard"
                type="password"
                placeholder="Konfirmasi Password"
                name="passwordConfirm"
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* submit  */}
        <Box mb={3}>
          <ContentLayout>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="outlined"
              color="primary"
              className="primary-bg-btn"
            >
              {formik.isSubmitting ? "Memproses ..." : "Simpan"}
            </Button>
          </ContentLayout>
        </Box>
      </form>
    </div>
  );
}

export default UserTPSFormPassword;
