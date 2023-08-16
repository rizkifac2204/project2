import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// MUI
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

// components
import ContentLayout from "components/GlobalComponents/ContentLayout";

const validationSchema = yup.object({
  jenis: yup.string("Masukan Jenis").required("Harus Diisi"),
  nomor_urut: yup.number("Masukan Nomor Urut Caleg").required("Harus Diisi"),
  nama: yup.string("Masukan Nama Caleg").required("Harus Diisi"),
  partai_id: yup.string("Pilih Partai").when("jenis", {
    is: (v) => v && v !== "DPD",
    then: yup.string().required("Harus Pilih Partai"),
  }),
  dapil: yup.number("Masukan Dapil").when("jenis", {
    is: (v) => v && v !== "DPD",
    then: yup.number().required("Harus Isi Dapil"),
  }),
});

const handleSubmit = (values, setSubmitting) => {
  axios
    .post(`/api/caleg`, values)
    .then((res) => {
      toast.success(res.data.message);
    })
    .catch((err) => {
      const msg = err.response.data.message
        ? err.response.data.message
        : "Gagal Proses";
      toast.error(msg);
    })
    .then(() => {
      setSubmitting(false);
    });
};

function CalegFormAdd() {
  const formik = useFormik({
    initialValues: {
      jenis: "",
      partai_id: "",
      dapil: "",
      nomor_urut: "",
      nama: "",
      jenis_kelamin: "",
      alamat: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
  });

  // SERVICES JENIS
  const {
    data: jenis,
    isError: isErrorJenis,
    isLoading: isLoadingJenis,
    isFetching: isFetchingJenis,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["services", "jenis"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/jenis-caleg`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // PARTAI
  const {
    data: partai,
    isFetching: isFetchingPartai,
    isLoading: isLoadingPartai,
    isError: isErrorPartai,
    error: errorPartai,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["partais"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/partai`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // validasi ulang jika pilih jenis
  useEffect(() => {
    if (!jenis) return;
    formik.setFieldValue("partai_id", "");
    formik.setFieldValue("dapil", "");
  }, [formik.values.jenis, jenis]);

  return (
    <Box mt={3}>
      <form onSubmit={formik.handleSubmit}>
        {/* jenis  */}
        <Box mb={3}>
          <ContentLayout title="Jenis *">
            {isLoadingJenis && "Loading..."}
            {isErrorJenis && "Gagal Mengambil Data"}
            {jenis ? (
              <FormControl
                fullWidth
                required
                variant="standard"
                error={Boolean(formik.errors.jenis)}
              >
                <Select
                  name="jenis"
                  value={formik.values.jenis}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {jenis.map((i, idx) => (
                    <MenuItem key={idx} value={i} id={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.jenis && formik.errors.jenis}
            </FormHelperText>
          </ContentLayout>
        </Box>

        {formik.values.jenis !== "DPD" ? (
          <>
            {/* partai  */}
            <Box mb={3}>
              <ContentLayout title="Partai">
                {isLoadingPartai && "Loading..."}
                {isErrorPartai && "Gagal Mengambil Data"}
                {partai ? (
                  <FormControl
                    fullWidth
                    variant="standard"
                    error={Boolean(formik.errors.partai_id)}
                  >
                    <Select
                      name="partai_id"
                      value={formik.values.partai_id}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="">Pilih</MenuItem>
                      {partai.map((i, idx) => (
                        <MenuItem key={idx} value={i.id} id={i.id}>
                          {i.partai}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null}
                <FormHelperText style={{ color: "red" }}>
                  {formik.touched.partai_id && formik.errors.partai_id}
                </FormHelperText>
              </ContentLayout>
            </Box>

            {/* dapil  */}
            <Box mb={3}>
              <ContentLayout title="Dapil">
                <FormControl fullWidth>
                  <TextField
                    type="number"
                    variant="standard"
                    name="dapil"
                    placeholder="Dapil"
                    value={formik.values.dapil}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dapil && Boolean(formik.errors.dapil)}
                    helperText={formik.touched.dapil && formik.errors.dapil}
                  />
                </FormControl>
              </ContentLayout>
            </Box>
          </>
        ) : null}

        {/* nomor_urut  */}
        <Box mb={3}>
          <ContentLayout title="Nomor Urut *">
            <FormControl fullWidth>
              <TextField
                required
                type="number"
                variant="standard"
                name="nomor_urut"
                placeholder="Nomor Urut Caleg"
                value={formik.values.nomor_urut}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.nomor_urut && Boolean(formik.errors.nomor_urut)
                }
                helperText={
                  formik.touched.nomor_urut && formik.errors.nomor_urut
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>

        {/* nama  */}
        <Box mb={3}>
          <ContentLayout title="Nama Caleg *">
            <FormControl fullWidth>
              <TextField
                required
                variant="standard"
                name="nama"
                placeholder="Nama Caleg"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama && Boolean(formik.errors.nama)}
                helperText={formik.touched.nama && formik.errors.nama}
              />
            </FormControl>
          </ContentLayout>
        </Box>

        {/* jenis_kelamin  */}
        <Box mb={3}>
          <ContentLayout title="Jenis Kelamin">
            <FormControl fullWidth error={Boolean(formik.errors.jenis_kelamin)}>
              <RadioGroup
                row
                aria-label="jenis_kelamin"
                name="jenis_kelamin"
                value={formik.values.jenis_kelamin}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value="Laki-Laki"
                  control={<Radio />}
                  label="Laki-Laki"
                />
                <FormControlLabel
                  value="Perempuan"
                  control={<Radio />}
                  label="Perempuan"
                />
              </RadioGroup>
            </FormControl>
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.jenis_kelamin && formik.errors.jenis_kelamin}
            </FormHelperText>
          </ContentLayout>
        </Box>

        {/* alamat  */}
        <Box mb={3}>
          <ContentLayout title="Alamat Caleg">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                multiline
                rows={3}
                name="alamat"
                placeholder="Alamat Caleg"
                value={formik.values.alamat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alamat && Boolean(formik.errors.alamat)}
                helperText={formik.touched.alamat && formik.errors.alamat}
              />
            </FormControl>
          </ContentLayout>
        </Box>

        {/* submit  */}
        <Box mb={3} mt={3}>
          <Button
            disabled={formik.isSubmitting}
            type="submit"
            variant="outlined"
            color="primary"
            className="primary-bg-btn"
          >
            {formik.isSubmitting ? "Memproses ..." : "Simpan"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default CalegFormAdd;
