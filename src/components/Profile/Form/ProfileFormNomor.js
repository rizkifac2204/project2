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
// components
import ContentLayout from "components/GlobalComponents/ContentLayout";
import Wait from "components/GlobalComponents/Wait";

const validationSchema = yup.object({
  passwordConfirm: yup.string().required("Password Harus Diisi"),
});

const useHandleSubmitMutation = () => {
  return useMutation(async (formPayload) => {
    return axios
      .put(`/api/profile/nomor`, formPayload)
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
      queryClient.invalidateQueries(["profile", "nomor"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setSubmitting(false),
  });
};

function ProfileFormNomor() {
  const { mutate } = useHandleSubmitMutation();
  const queryClient = useQueryClient();

  const {
    data: nomor,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", "nomor"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/profile/nomor`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const formik = useFormik({
    initialValues: nomor
      ? {
          no_ktp: nomor.no_ktp || "",
          no_nip: nomor.no_nip || "",
          no_karpeg: nomor.no_karpeg || "",
          no_bpjs_ketenagakerjaan: nomor.no_bpjs_ketenagakerjaan || "",
          no_bpjs_kesehatan: nomor.no_bpjs_kesehatan || "",
          no_taspen: nomor.no_taspen || "",
          no_karis: nomor.no_karis || "",
          no_npwp: nomor.no_npwp || "",
          no_kontrak: nomor.no_kontrak || "",
          passwordConfirm: "",
        }
      : {
          no_ktp: "",
          no_nip: "",
          no_karpeg: "",
          no_bpjs_ketenagakerjaan: "",
          no_bpjs_kesehatan: "",
          no_taspen: "",
          no_karis: "",
          no_npwp: "",
          no_kontrak: "",
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
        {/* input no_ktp  */}
        <Box mb={3}>
          <ContentLayout title="KTP">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_ktp"
                placeholder=""
                value={formik.values.no_ktp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.no_ktp && Boolean(formik.errors.no_ktp)}
                helperText={formik.touched.no_ktp && formik.errors.no_ktp}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_nip  */}
        <Box mb={3}>
          <ContentLayout title="NIP">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_nip"
                placeholder=""
                value={formik.values.no_nip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.no_nip && Boolean(formik.errors.no_nip)}
                helperText={formik.touched.no_nip && formik.errors.no_nip}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_karpeg  */}
        <Box mb={3}>
          <ContentLayout title="NO. KARPEG">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_karpeg"
                placeholder=""
                value={formik.values.no_karpeg}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_karpeg && Boolean(formik.errors.no_karpeg)
                }
                helperText={formik.touched.no_karpeg && formik.errors.no_karpeg}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_bpjs_ketenagakerjaan  */}
        <Box mb={3}>
          <ContentLayout title="NO. BPJS KETENAGAKERJAAN">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_bpjs_ketenagakerjaan"
                placeholder=""
                value={formik.values.no_bpjs_ketenagakerjaan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_bpjs_ketenagakerjaan &&
                  Boolean(formik.errors.no_bpjs_ketenagakerjaan)
                }
                helperText={
                  formik.touched.no_bpjs_ketenagakerjaan &&
                  formik.errors.no_bpjs_ketenagakerjaan
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_bpjs_kesehatan  */}
        <Box mb={3}>
          <ContentLayout title="NO. BPJS KESEHATAN">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_bpjs_kesehatan"
                placeholder=""
                value={formik.values.no_bpjs_kesehatan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_bpjs_kesehatan &&
                  Boolean(formik.errors.no_bpjs_kesehatan)
                }
                helperText={
                  formik.touched.no_bpjs_kesehatan &&
                  formik.errors.no_bpjs_kesehatan
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_taspen  */}
        <Box mb={3}>
          <ContentLayout title="NO. TASPEN">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_taspen"
                placeholder=""
                value={formik.values.no_taspen}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_taspen && Boolean(formik.errors.no_taspen)
                }
                helperText={formik.touched.no_taspen && formik.errors.no_taspen}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_karis  */}
        <Box mb={3}>
          <ContentLayout title="NO. KARIS">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_karis"
                placeholder=""
                value={formik.values.no_karis}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_karis && Boolean(formik.errors.no_karis)
                }
                helperText={formik.touched.no_karis && formik.errors.no_karis}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_npwp  */}
        <Box mb={3}>
          <ContentLayout title="NO. NPWP">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_npwp"
                placeholder=""
                value={formik.values.no_npwp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.no_npwp && Boolean(formik.errors.no_npwp)}
                helperText={formik.touched.no_npwp && formik.errors.no_npwp}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input no_kontrak  */}
        <Box mb={3}>
          <ContentLayout title="NO. KONTRAK">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="no_kontrak"
                placeholder=""
                value={formik.values.no_kontrak}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_kontrak && Boolean(formik.errors.no_kontrak)
                }
                helperText={
                  formik.touched.no_kontrak && formik.errors.no_kontrak
                }
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

export default ProfileFormNomor;
