import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// components
import ContentLayout from "components/GlobalComponents/ContentLayout";

const validationSchema = yup.object({
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  email: yup.string("Masukan Email").email("Email Tidak Valid"),
  username: yup.string().required("Username Harus Diisi"),
});

const useHandleSubmitMutation = (user) => {
  return useMutation(async (formPayload) => {
    return axios
      .put(`/api/user-tps/${user.id}`, formPayload)
      .then((res) => res.data)
      .catch((err) => {
        let tempMassage = "Gagal Proses";
        if (err.response.status == 404) {
          tempMassage =
            "Mohon Maaf, Hilangkan atau ganti spesial karakter pada inputan anda";
        }
        const msg = err.response.data.message
          ? err.response.data.message
          : tempMassage;
        throw new Error(msg);
      });
  });
};

const handleSubmit = (values, setSubmitting, mutate, refetch) => {
  mutate(values, {
    onSuccess: (response) => {
      toast.success(response.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setSubmitting(false),
  });
};

function UserTPSFormUtama({ user, refetch }) {
  const { mutate } = useHandleSubmitMutation(user);

  const formik = useFormik({
    initialValues: user
      ? {
          nama: user.nama || "",
          telp: user.telp || "",
          email: user.email || "",
          username: user.username || "",
        }
      : {
          nama: "",
          telp: "",
          email: "",
          username: "",
        },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, mutate, refetch),
  });

  return (
    <div className="hk-general-settings">
      <form onSubmit={formik.handleSubmit}>
        {/* input TPS disabled  */}
        <Box mb={3}>
          <ContentLayout title="TPS *">
            <FormControl fullWidth>
              <TextField
                disabled
                variant="standard"
                name="level"
                placeholder="Level"
                value={`${user.kelurahan} TPS ${user.tps_no}`}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input nama  */}
        <Box mb={3}>
          <ContentLayout title="Nama *">
            <FormControl fullWidth>
              <TextField
                required
                variant="standard"
                name="nama"
                placeholder="Nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama && Boolean(formik.errors.nama)}
                helperText={formik.touched.nama && formik.errors.nama}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input telp  */}
        <Box mb={3}>
          <ContentLayout title="Telp / HP">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="telp"
                placeholder="Telp"
                value={formik.values.telp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.telp && Boolean(formik.errors.telp)}
                helperText={formik.touched.telp && formik.errors.telp}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input email  */}
        <Box mb={3}>
          <ContentLayout title="Email">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="email"
                placeholder="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input username  */}
        <Box mb={3}>
          <ContentLayout title="Username *">
            <FormControl fullWidth>
              <TextField
                required
                variant="standard"
                placeholder="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </FormControl>
          </ContentLayout>
        </Box>

        {/* Submit  */}
        <Box mb={3}>
          <ContentLayout>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="outlined"
              color="primary"
              className="primary-bg-btn"
            >
              {formik.isSubmitting ? "Memproses ..." : "Update"}
            </Button>
          </ContentLayout>
        </Box>
      </form>
    </div>
  );
}

export default UserTPSFormUtama;
