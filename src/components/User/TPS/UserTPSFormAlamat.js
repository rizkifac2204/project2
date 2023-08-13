import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
// MUI
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// components
import ContentLayout from "components/GlobalComponents/ContentLayout";
import Wait from "components/GlobalComponents/Wait";

const validationSchema = yup.object({
  alamat: yup.string().required("Harus Diisi"),
  rt: yup.string().required("Harus Diisi"),
  rw: yup.string().required("Harus Diisi"),
  provinsi: yup.string().required("Harus Dipilih"),
  kabkota: yup.string().required("Harus Dipilih"),
  kecamatan: yup.string().required("Harus Dipilih"),
  kelurahan: yup.string().required("Harus Dipilih"),
});

const useHandleSubmitMutation = (user) => {
  return useMutation(async (formPayload) => {
    try {
      const res = await axios.put(
        `/api/user-tps/${user.id}/alamat`,
        formPayload
      );
      return res.data;
    } catch (err) {
      const msg = err.response.data.message
        ? err.response.data.message
        : "Gagal Proses";
      throw new Error(msg);
    }
  });
};

const handleSubmit = (values, setSubmitting, mutate, queryClient, user) => {
  mutate(values, {
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries(["user-tps", user.id, "alamat"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setSubmitting(false),
  });
};

function UserTPSFormAlamat({ user }) {
  const { mutate } = useHandleSubmitMutation(user);
  const queryClient = useQueryClient();

  const [selectedProvinsi, setSelectedProvinsi] = useState({});
  const [selectedKabkota, setSelectedKabkota] = useState({});
  const [selectedKecamatan, setSelectedKecamatan] = useState({});
  const [selectedKelurahan, setSelectedKelurahan] = useState({});
  const idProvinsi = selectedProvinsi?.id || null;
  const idKabkota = selectedKabkota?.id || null;
  const idKecamatan = selectedKecamatan?.id || null;
  const idKelurahan = selectedKelurahan?.id || null;

  const {
    data: alamat,
    isError,
    isLoading,
    error,
  } = useQuery({
    enabled: !!user,
    queryKey: ["user-tps", user.id, "alamat"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/user-tps/${user.id}/alamat`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // SERVICES PROVINSI
  const {
    data: provinsi,
    isError: isErrorProvinsi,
    isLoading: isLoadingProvinsi,
    isFetching: isFetchingProvinsi,
  } = useQuery({
    queryKey: ["services", "provinsi"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/provinsi`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // SERVICES KABKOTA
  const {
    data: kabkota,
    isError: isErrorKabkota,
    isLoading: isLoadingKabkota,
    isFetching: isFetchingKabkota,
  } = useQuery({
    enabled: !!idProvinsi,
    queryKey: ["services", "provinsi", idProvinsi, "kabkota"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/services/provinsi/${idProvinsi}/kabkota`, {
          signal,
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // SERVICES KECAMATAN
  const {
    data: kecamatan,
    isError: isErrorKecamatan,
    isLoading: isLoadingKecamatan,
    isFetching: isFetchingKecamatan,
  } = useQuery({
    enabled: !!idKabkota,
    queryKey: [
      "services",
      "provinsi",
      idProvinsi,
      "kabkota",
      idKabkota,
      "kecamatan",
    ],
    queryFn: ({ signal }) =>
      axios
        .get(
          `/api/services/provinsi/${idProvinsi}/kabkota/${idKabkota}/kecamatan`,
          {
            signal,
          }
        )
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  // SERVICES KELURAHAN
  const {
    data: kelurahan,
    isError: isErrorKelurahan,
    isLoading: isLoadingKelurahan,
    isFetching: isFetchingKelurahan,
  } = useQuery({
    enabled: !!idKecamatan,
    queryKey: [
      "services",
      "provinsi",
      idProvinsi,
      "kabkota",
      idKabkota,
      "kecamatan",
      idKecamatan,
      "kelurahan",
    ],
    queryFn: ({ signal }) =>
      axios
        .get(
          `/api/services/provinsi/${idProvinsi}/kabkota/${idKabkota}/kecamatan/${idKecamatan}/kelurahan`,
          {
            signal,
          }
        )
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const formik = useFormik({
    initialValues: alamat
      ? {
          alamat: alamat.alamat || "",
          rt: alamat.rt || "",
          rw: alamat.rw || "",
          provinsi: alamat.provinsi || "",
          kabkota: alamat.kabkota || "",
          kecamatan: alamat.kecamatan || "",
          kelurahan: alamat.kelurahan || "",
          kode_pos: alamat.kode_pos || "",
        }
      : {
          alamat: "",
          rt: "",
          rw: "",
          provinsi: "",
          kabkota: "",
          kecamatan: "",
          kelurahan: "",
          kode_pos: "",
        },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, mutate, queryClient, user),
  });

  // validasi ulang kebupaten jika pilih provinsi
  useEffect(() => {
    if (!provinsi) return;
    const selected = provinsi.filter((prov) => {
      return (
        prov.provinsi.toLowerCase() === formik.values.provinsi.toLowerCase()
      );
    });
    setSelectedProvinsi(selected[0]);

    if (selected.length !== 0) {
      if (alamat.provinsi !== selected[0].provinsi) {
        formik.setFieldValue("kabkota", "");
        formik.setFieldValue("kecamatan", "");
        formik.setFieldValue("kelurahan", "");
      } else {
        formik.setFieldValue("kabkota", alamat.kabkota);
      }
    } else {
      formik.setFieldValue("kabkota", "");
      formik.setFieldValue("kecamatan", "");
      formik.setFieldValue("kelurahan", "");
    }
  }, [formik.values.provinsi, provinsi]);

  // validasi ulang kecamatan jika pilih kabkota
  useEffect(() => {
    if (!kabkota) return;
    const selected = kabkota.filter((kabkota) => {
      return (
        kabkota.kabkota.toLowerCase() === formik.values.kabkota.toLowerCase()
      );
    });
    setSelectedKabkota(selected[0]);

    if (selected.length !== 0) {
      if (alamat.kabkota !== selected[0].kabkota) {
        formik.setFieldValue("kecamatan", "");
        formik.setFieldValue("kelurahan", "");
      } else {
        formik.setFieldValue("kecamatan", alamat.kecamatan);
      }
    } else {
      formik.setFieldValue("kecamatan", "");
      formik.setFieldValue("kelurahan", "");
    }
  }, [formik.values.kabkota, kabkota]);

  // validasi ulang kelurahan jika pilih kecamatan
  useEffect(() => {
    if (!kecamatan) return;
    const selected = kecamatan.filter((kecamatan) => {
      return (
        kecamatan.kecamatan.toLowerCase() ===
        formik.values.kecamatan.toLowerCase()
      );
    });
    setSelectedKecamatan(selected[0]);

    if (selected.length !== 0) {
      if (alamat.kecamatan !== selected[0].kecamatan) {
        formik.setFieldValue("kelurahan", "");
      } else {
        formik.setFieldValue("kelurahan", alamat.kelurahan);
      }
    } else {
      formik.setFieldValue("kelurahan", "");
    }
  }, [formik.values.kecamatan, kecamatan]);

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
        {/* input alamat  */}
        <Box mb={3}>
          <ContentLayout title="Alamat *">
            <FormControl fullWidth>
              <TextField
                required
                variant="standard"
                name="alamat"
                placeholder="Alamat"
                value={formik.values.alamat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alamat && Boolean(formik.errors.alamat)}
                helperText={formik.touched.alamat && formik.errors.alamat}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input RT RW  */}
        <Box mb={3}>
          <ContentLayout title="RT / RW *">
            <FormControl>
              <TextField
                required
                variant="standard"
                name="rt"
                placeholder="RT"
                value={formik.values.rt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rt && Boolean(formik.errors.rt)}
                helperText={formik.touched.rt && formik.errors.rt}
              />
            </FormControl>{" "}
            <FormControl>
              <TextField
                required
                variant="standard"
                name="rw"
                placeholder="RW"
                value={formik.values.rw}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.rw && Boolean(formik.errors.rw)}
                helperText={formik.touched.rw && formik.errors.rw}
              />
            </FormControl>
          </ContentLayout>
        </Box>
        {/* input provinsi  */}
        <Box mb={3}>
          <ContentLayout title="Provinsi *">
            {isLoadingProvinsi && "Loading..."}
            {isErrorProvinsi && "Gagal Mengambil Data"}
            {provinsi ? (
              <FormControl
                fullWidth
                required
                variant="standard"
                error={Boolean(formik.errors.provinsi)}
              >
                <Select
                  name="provinsi"
                  value={formik.values.provinsi}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {provinsi.map((i, idx) => (
                    <MenuItem key={idx} value={i.provinsi} id={i.id}>
                      {i.provinsi}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.provinsi && formik.errors.provinsi}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input kabkota  */}
        <Box mb={3}>
          <ContentLayout title="Kabupaten/Kota *">
            {isFetchingKabkota && "Memuat..."}
            {isLoadingKabkota && "Menunggu Pilihan Provinsi..."}
            {isErrorKabkota && "Gagal Mengambil Data"}
            {kabkota ? (
              <FormControl
                required
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.kabkota)}
              >
                <Select
                  name="kabkota"
                  value={formik.values.kabkota}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {kabkota.map((i, idx) => (
                    <MenuItem key={idx} value={i.kabkota} id={i.id}>
                      {i.kabkota}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.kabkota && formik.errors.kabkota}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input kecamatan  */}
        <Box mb={3}>
          <ContentLayout title="Kecamatan *">
            {isFetchingKecamatan && "Memuat..."}
            {isLoadingKecamatan && "Menunggu Pilihan Kabupaten/Kota..."}
            {isErrorKecamatan && "Gagal Mengambil Data"}
            {kecamatan ? (
              <FormControl
                required
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.kecamatan)}
              >
                <Select
                  name="kecamatan"
                  value={formik.values.kecamatan}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {kecamatan.map((i, idx) => (
                    <MenuItem key={idx} value={i.kecamatan} id={i.id}>
                      {i.kecamatan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.kecamatan && formik.errors.kecamatan}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input kelurahan  */}
        <Box mb={3}>
          <ContentLayout title="Kelurahan/Desa *">
            {isFetchingKelurahan && "Memuat..."}
            {isLoadingKelurahan && "Menunggu Pilihan Kecamatan..."}
            {isErrorKelurahan && "Gagal Mengambil Data"}
            {kelurahan ? (
              <FormControl
                required
                fullWidth
                variant="standard"
                error={Boolean(formik.errors.kelurahan)}
              >
                <Select
                  name="kelurahan"
                  value={formik.values.kelurahan}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">Pilih</MenuItem>
                  {kelurahan.map((i, idx) => (
                    <MenuItem key={idx} value={i.kelurahan} id={i.id}>
                      {i.kelurahan}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <FormHelperText style={{ color: "red" }}>
              {formik.touched.kelurahan && formik.errors.kelurahan}
            </FormHelperText>
          </ContentLayout>
        </Box>
        {/* input kode_pos  */}
        <Box mb={3}>
          <ContentLayout title="Kode Pos">
            <FormControl fullWidth>
              <TextField
                variant="standard"
                name="kode_pos"
                placeholder="Kode Pos"
                type="number"
                value={formik.values.kode_pos}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.kode_pos && Boolean(formik.errors.kode_pos)
                }
                helperText={formik.touched.kode_pos && formik.errors.kode_pos}
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

export default UserTPSFormAlamat;
