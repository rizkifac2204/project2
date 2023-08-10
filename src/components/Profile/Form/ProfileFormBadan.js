import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// MUI
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
// components
import ContentLayout from "components/GlobalComponents/ContentLayout";
import Wait from "components/GlobalComponents/Wait";

const validationSchema = yup.object({
  passwordConfirm: yup.string().required("Password Harus Diisi"),
});

const useHandleSubmitMutation = () => {
  return useMutation(async (formPayload) => {
    return axios
      .put(`/api/profile/badan`, formPayload)
      .then((res) => res.data)
      .catch((err) => {
        const msg = err.response.data.message
          ? err.response.data.message
          : "Gagal Proses";
        throw new Error(msg);
      });
  });
};

const handleSubmit = (values, setSubmitting, mutate, queryClient) => {
  mutate(values, {
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries(["profile", "badan"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setSubmitting(false),
  });
};

function ProfileFormBadan() {
  const { mutate } = useHandleSubmitMutation();
  const queryClient = useQueryClient();

  const {
    data: badan,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", "badan"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/profile/badan`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // UTILS BENTUK WAJAH
  const {
    data: bentuk_wajah,
    isError: isErrorBentukWajah,
    isLoading: isLoadingBentukWajah,
  } = useQuery({
    queryKey: ["utils", "bentuk_wajah"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/utils/bentuk-wajah`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // UTILS KULIT
  const {
    data: warna_kulit,
    isError: isErrorWarnaKulit,
    isLoading: isLoadingWarnaKulit,
  } = useQuery({
    queryKey: ["utils", "kulit"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/utils/kulit`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // UTILS RAMBUT
  const {
    data: rambut,
    isError: isErrorRambut,
    isLoading: isLoadingRambut,
  } = useQuery({
    queryKey: ["utils", "rambut"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/utils/rambut`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const formik = useFormik({
    initialValues: badan
      ? {
          tinggi: badan.tinggi || "",
          berat: badan.berat || "",
          warna_kulit: badan.warna_kulit || "",
          jenis_rambut: badan.jenis_rambut || "",
          bentuk_wajah: badan.bentuk_wajah || "",
          ukuran_baju: badan.ukuran_baju || "",
          ukuran_celana: badan.ukuran_celana || "",
          ukuran_sepatu: badan.ukuran_sepatu || "",
          ciri_khas: badan.ciri_khas || "",
          cacat: badan.cacat || "",
          passwordConfirm: "",
        }
      : {
          tinggi: "",
          berat: "",
          warna_kulit: "",
          jenis_rambut: "",
          bentuk_wajah: "",
          ukuran_baju: "",
          ukuran_celana: "",
          ukuran_sepatu: "",
          ciri_khas: "",
          cacat: "",
          passwordConfirm: "",
        },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, mutate, queryClient),
  });

  if (isLoading) return <Wait loading={true} />;
  if (isError)
    return (
      <Alert
        sx={{ mt: 2 }}
        severity="error"
      >{`An error has occurred: ${error.message}`}</Alert>
    );

  return (
    <div className="hk-general-settings">
      <form onSubmit={formik.handleSubmit}>
        {/* input tinggi  */}
        <Box mb={3}>
          <ContentLayout title="Tinggi Badan">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="tinggi"
                placeholder="Tinggi Badan Dalam cm"
                value={formik.values.tinggi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tinggi && Boolean(formik.errors.tinggi)}
                helperText={formik.touched.tinggi && formik.errors.tinggi}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">cm</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input berat  */}
        <Box mb={3}>
          <ContentLayout title="Berat Badan">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="berat"
                placeholder="Berat Badan Dalam kg"
                value={formik.values.berat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.berat && Boolean(formik.errors.berat)}
                helperText={formik.touched.berat && formik.errors.berat}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">kg</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input warna_kulit  */}
        <Box mb={3}>
          <ContentLayout title="Warna Kulit">
            {isLoadingWarnaKulit && "Loading..."}
            {isErrorWarnaKulit && "Gagal Mengambil Data"}
            {warna_kulit ? (
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.warna_kulit)}
              >
                <Select
                  name="warna_kulit"
                  value={formik.values.warna_kulit}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {warna_kulit.map((i, idx) => (
                    <MenuItem key={idx} value={i.kulit}>
                      {i.kulit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.warna_kulit && formik.errors.warna_kulit}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input jenis_rambut  */}
        <Box mb={3}>
          <ContentLayout title="Jenis Rambut">
            {isLoadingRambut && "Loading..."}
            {isErrorRambut && "Gagal Mengambil Data"}
            {rambut ? (
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.jenis_rambut)}
              >
                <Select
                  name="jenis_rambut"
                  value={formik.values.jenis_rambut}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {rambut.map((i, idx) => (
                    <MenuItem key={idx} value={i.rambut}>
                      {i.rambut}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.jenis_rambut && formik.errors.jenis_rambut}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input bentuk_wajah  */}
        <Box mb={3}>
          <ContentLayout title="Bentuk Wajah">
            {isLoadingBentukWajah && "Loading..."}
            {isErrorBentukWajah && "Gagal Mengambil Data"}
            {bentuk_wajah ? (
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.bentuk_wajah)}
              >
                <Select
                  name="bentuk_wajah"
                  value={formik.values.bentuk_wajah}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {bentuk_wajah.map((i, idx) => (
                    <MenuItem key={idx} value={i.bentuk}>
                      {i.bentuk}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.bentuk_wajah && formik.errors.bentuk_wajah}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input ukuran_baju  */}
        <Box mb={3}>
          <ContentLayout title="Ukuran Baju">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="ukuran_baju"
                placeholder="Nomor Ukuran"
                value={formik.values.ukuran_baju}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.ukuran_baju &&
                  Boolean(formik.errors.ukuran_baju)
                }
                helperText={
                  formik.touched.ukuran_baju && formik.errors.ukuran_baju
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input ukuran_celana */}
        <Box mb={3}>
          <ContentLayout title="Ukuran Celana">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="ukuran_celana"
                placeholder="Nomor Ukuran"
                value={formik.values.ukuran_celana}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.ukuran_celana &&
                  Boolean(formik.errors.ukuran_celana)
                }
                helperText={
                  formik.touched.ukuran_celana && formik.errors.ukuran_celana
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input ukuran_sepatu */}
        <Box mb={3}>
          <ContentLayout title="Ukuran Sepatu">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="ukuran_sepatu"
                placeholder="Nomor Ukuran"
                value={formik.values.ukuran_sepatu}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.ukuran_sepatu &&
                  Boolean(formik.errors.ukuran_sepatu)
                }
                helperText={
                  formik.touched.ukuran_sepatu && formik.errors.ukuran_sepatu
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input ciri_khas */}
        <Box mb={3}>
          <ContentLayout title="Ciri Khas">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="ciri_khas"
                placeholder="Ciri"
                value={formik.values.ciri_khas}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.ciri_khas && Boolean(formik.errors.ciri_khas)
                }
                helperText={formik.touched.ciri_khas && formik.errors.ciri_khas}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input cacat */}
        <Box mb={3}>
          <ContentLayout title="Cacat Tubuh">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="cacat"
                placeholder="Cacat Tubuh"
                value={formik.values.cacat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cacat && Boolean(formik.errors.cacat)}
                helperText={formik.touched.cacat && formik.errors.cacat}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input konfirmasi  */}
        <Box mb={3}>
          <ContentLayout title="Password Lama *">
            <FormControl fullWidth>
              <TextField
                required
                variant="standard"
                type="password"
                placeholder="Konfirmasi Password Lama"
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

export default ProfileFormBadan;
