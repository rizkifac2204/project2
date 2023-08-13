import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// components
import ContentLayout from "components/GlobalComponents/ContentLayout";

const validationSchema = yup.object({
  level_id: yup.number().required("Harus Dipilih"),
  verifikator: yup.boolean("Masukan verifikator").required("Harus Dipilih"),
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  telp: yup.string("Masukan Telp/HP"),
  email: yup.string("Masukan Email").email("Email Tidak Valid"),
  username: yup.string().required("Username Harus Diisi"),
  password: yup.string().required("Password Harus Diisi"),
  passwordConfirm: yup
    .string()
    .required("Konfirmasi Password Harus Diisi")
    .oneOf([yup.ref("password"), null], "Passwords Tidak Sama"),
});

const handleSubmit = (values, setSubmitting) => {
  axios
    .post(`/api/user`, values)
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((err) => {
      console.log(err);
      const msg = err?.response?.data?.message
        ? err.response.data.message
        : "Gagal Proses";
      toast.error(msg);
    })
    .then(() => {
      setSubmitting(false);
    });
};

function FormUserAdd() {
  const initialvalues = {
    level_id: "",
    verifikator: false,
    nama: "",
    telp: "",
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  };

  // SERVICES LEVEL
  const {
    data: level,
    isError: isErrorLevel,
    isLoading: isLoadingLevel,
    isFetching: isFetchingLevel,
  } = useQuery({
    initialData: [],
    queryKey: ["services", "level"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/level`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const formik = useFormik({
    initialValues: initialvalues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* input level  */}
      <Box mb={3}>
        <ContentLayout title="Level *">
          {isLoadingLevel && "Loading..."}
          {isErrorLevel && "Gagal Mengambil Data"}
          {level ? (
            <FormControl
              fullWidth
              required
              variant="standard"
              error={Boolean(formik.errors.level_id)}
            >
              <Select
                name="level_id"
                value={formik.values.level_id}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Pilih</MenuItem>

                {level.map((i, idx) => (
                  <MenuItem key={idx} value={i.id}>
                    {i.level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
          <FormHelperText style={{ color: "red" }}>
            {formik.touched.level_id && formik.errors.level_id}
          </FormHelperText>
        </ContentLayout>
      </Box>
      {/* input nama  */}
      <Box mb={3}>
        <ContentLayout title="Nama User *">
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
        <ContentLayout title="Nomor Telp/HP">
          <FormControl fullWidth>
            <TextField
              variant="standard"
              name="telp"
              placeholder="Telp/HP"
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
              type="email"
              variant="standard"
              name="email"
              placeholder="Email"
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
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </FormControl>
        </ContentLayout>
      </Box>
      {/* input password  */}
      <Box mb={3}>
        <ContentLayout title="Password *">
          <FormControl fullWidth>
            <TextField
              required
              type="password"
              variant="standard"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </FormControl>
        </ContentLayout>
      </Box>
      {/* input passwordConfirm  */}
      <Box mb={3}>
        <ContentLayout title="Ulangi Password *">
          <FormControl fullWidth>
            <TextField
              required
              type="password"
              variant="standard"
              name="passwordConfirm"
              placeholder="Ulangi Password"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.passwordConfirm &&
                Boolean(formik.errors.passwordConfirm)
              }
              helperText={
                formik.touched.passwordConfirm && formik.errors.passwordConfirm
              }
            />
          </FormControl>
        </ContentLayout>
      </Box>
      {/* input verifikator  */}
      {formik.values.level_id !== 5 && (
        <Box mb={3}>
          <ContentLayout>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="verifikator"
                    checked={formik.values.verifikator}
                    onChange={(e) => {
                      formik.setFieldValue("verifikator", e.target.checked);
                    }}
                  />
                }
                label=" Buat Sebagai Verifikator"
              />
            </FormGroup>
          </ContentLayout>
        </Box>
      )}
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
  );
}

export default FormUserAdd;
