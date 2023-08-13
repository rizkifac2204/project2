import { useState } from "react";
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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
// components
import ContentLayout from "components/GlobalComponents/ContentLayout";
import Wait from "components/GlobalComponents/Wait";

const validationSchema = yup.object({
  tanggal_lahir: yup.date(),
});

const useHandleSubmitMutation = (user) => {
  return useMutation(async (formPayload) => {
    return axios
      .put(`/api/user-tps/${user.id}/umum`, formPayload)
      .then((res) => res.data)
      .catch((err) => {
        const msg = err.response.data.message
          ? err.response.data.message
          : "Gagal Proses";
        throw new Error(msg);
      });
  });
};

const handleSubmit = (values, setSubmitting, mutate, queryClient, user) => {
  mutate(values, {
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries(["user-tps", user.id, "umum"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setSubmitting(false),
  });
};

function UserTPSFormUmum({ user }) {
  const { mutate } = useHandleSubmitMutation(user);
  const queryClient = useQueryClient();

  const {
    data: umum,
    isError,
    isLoading,
    error,
  } = useQuery({
    enabled: !!user,
    queryKey: ["user-tps", user.id, "umum"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/user-tps/${user.id}/umum`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // UTILS AGAMA
  const {
    data: agama,
    isError: isErrorAgama,
    isLoading: isLoadingAgama,
  } = useQuery({
    queryKey: ["utils", "agama"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/utils/agama`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // UTILS PERNIKAHAN
  const {
    data: pernikahan,
    isError: isErrorPernikahan,
    isLoading: isLoadingPernikahan,
  } = useQuery({
    queryKey: ["utils", "pernikahan"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/utils/pernikahan`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const formik = useFormik({
    initialValues: umum
      ? {
          agama: umum.agama || "",
          jenis_kelamin: umum.jenis_kelamin || "",
          tempat_lahir: umum.tempat_lahir || "",
          tanggal_lahir: umum.tanggal_lahir ? new Date(umum.tanggal_lahir) : "",
          golongan_darah: umum.golongan_darah || "",
          status_nikah: umum.status_nikah || "",
          gelar_depan: umum.gelar_depan || "",
          gelar_belakang: umum.gelar_belakang || "",
          hobi: umum.hobi || "",
          keahlian: umum.keahlian || "",
        }
      : {
          agama: "",
          jenis_kelamin: "",
          tempat_lahir: "",
          tanggal_lahir: "",
          golongan_darah: "",
          status_nikah: "",
          gelar_depan: "",
          gelar_belakang: "",
          hobi: "",
          keahlian: "",
        },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, mutate, queryClient, user),
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
        {/* input gelar_depan  */}
        <Box mb={3}>
          <ContentLayout title="Gelar Depan">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="gelar_depan"
                placeholder="Gelar Depan"
                value={formik.values.gelar_depan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.gelar_depan &&
                  Boolean(formik.errors.gelar_depan)
                }
                helperText={
                  formik.touched.gelar_depan && formik.errors.gelar_depan
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input gelar_belakang  */}
        <Box mb={3}>
          <ContentLayout title="Gelar Belakang">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="gelar_belakang"
                placeholder="Gelar Belakang"
                value={formik.values.gelar_belakang}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.gelar_belakang &&
                  Boolean(formik.errors.gelar_belakang)
                }
                helperText={
                  formik.touched.gelar_belakang && formik.errors.gelar_belakang
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input agama  */}
        <Box mb={3}>
          <ContentLayout title="Agama">
            {isLoadingAgama && "Loading..."}
            {isErrorAgama && "Gagal Mengambil Data"}
            {agama ? (
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.agama)}
              >
                <Select
                  name="agama"
                  value={formik.values.agama}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {agama.map((i, idx) => (
                    <MenuItem key={idx} value={i.agama}>
                      {i.agama}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.agama && formik.errors.agama}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input jenis_kelamin  */}
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
        {/* input tempat_lahir  */}
        <Box mb={3}>
          <ContentLayout title="Tempat Lahir">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="tempat_lahir"
                placeholder="Tempat Lahir"
                value={formik.values.tempat_lahir}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tempat_lahir &&
                  Boolean(formik.errors.tempat_lahir)
                }
                helperText={
                  formik.touched.tempat_lahir && formik.errors.tempat_lahir
                }
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input tanggal_lahir  */}
        <Box mb={3}>
          <ContentLayout title="Tanggal Lahir">
            <FormControl fullWidth>
              <MobileDatePicker
                inputFormat="DD-MM-YYYY"
                value={formik.values.tanggal_lahir}
                onChange={(value) => {
                  formik.setFieldValue("tanggal_lahir", new Date(value));
                }}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    helperText={
                      formik.touched.tanggal_lahir &&
                      formik.errors.tanggal_lahir
                    }
                    error={
                      formik.touched.tanggal_lahir &&
                      Boolean(formik.errors.tanggal_lahir)
                    }
                  />
                )}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input golongan_darah  */}
        <Box mb={3}>
          <ContentLayout title="Golongan Darah">
            <FormControl
              fullWidth
              variant="standard"
              error={Boolean(formik.errors.golongan_darah)}
            >
              <Select
                name="golongan_darah"
                value={formik.values.golongan_darah}
                onChange={formik.handleChange}
              >
                <MenuItem value="">Pilih</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="AB">AB</MenuItem>
                <MenuItem value="O">O</MenuItem>
              </Select>
            </FormControl>
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.golongan_darah && formik.errors.golongan_darah}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input status_nikah  */}
        <Box mb={3}>
          <ContentLayout title="Status Nikah">
            {isLoadingPernikahan && "Loading..."}
            {isErrorPernikahan && "Gagal Mengambil Data"}
            {pernikahan ? (
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.status_nikah)}
              >
                <Select
                  name="status_nikah"
                  value={formik.values.status_nikah}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {pernikahan.map((i, idx) => (
                    <MenuItem key={idx} value={i.pernikahan}>
                      {i.pernikahan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.status_nikah && formik.errors.status_nikah}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input hobi  */}
        <Box mb={3}>
          <ContentLayout title="Hobi">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="hobi"
                placeholder="Hobi"
                value={formik.values.hobi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.hobi && Boolean(formik.errors.hobi)}
                helperText={formik.touched.hobi && formik.errors.hobi}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input keahlian  */}
        <Box mb={3}>
          <ContentLayout title="Keahlian">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="keahlian"
                placeholder="Keahlian"
                value={formik.values.keahlian}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.keahlian && Boolean(formik.errors.keahlian)
                }
                helperText={formik.touched.keahlian && formik.errors.keahlian}
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

export default UserTPSFormUmum;
