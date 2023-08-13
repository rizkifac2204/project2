import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { makeStyles } from "@mui/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// components
import Thumb from "components/GlobalComponents/Thumb";
import ContentLayout from "components/GlobalComponents/ContentLayout";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  profileThumb: {
    "& >div": {
      "& >div": {
        "& >div:first-child": {
          alignSelf: "center",
        },
      },
    },
  },
  fileUpload: {
    "& input": {
      height: "auto",
    },
  },
}));

const validationSchema = yup.object({
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  telp: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email: yup.string("Masukan Email").email("Email Tidak Valid"),
  username: yup.string().required("Username Harus Diisi"),
  file: yup
    .mixed()
    .test(
      "FILE_SIZE",
      "Ukuran Gambar Tidak Boleh Melebihi 5mb.",
      (value) => !value || (value && value.size <= 5_000_000)
    )
    .test(
      "FILE_FORMAT",
      "Format Gambar Tidak Sesuai.",
      (value) =>
        !value ||
        (value &&
          [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/bmp",
          ].includes(value.type))
    ),
});

const useHandleSubmitMutation = (user) => {
  return useMutation(async (formPayload) => {
    return axios
      .put(`/api/user/${user.id}/edit`, formPayload, {
        headers: {
          "content-type": "multipart/form-data",
          destinationfile: "foto",
        },
        onUploadProgress: (event) => {
          console.log(
            `Current progress:`,
            Math.round((event.loaded * 100) / event.total)
          );
        },
      })
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
  const form = new FormData();
  for (var key in values) {
    form.append(key, values[key]);
  }
  mutate(form, {
    onSuccess: (response) => {
      toast.success(response.message);
      // fetch/ambil ulang data
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setSubmitting(false),
  });
};

function UserFormUtama({ user, refetch }) {
  const classes = useStyles();
  const { mutate } = useHandleSubmitMutation(user);

  const formik = useFormik({
    initialValues: user
      ? {
          foto: user.foto || "",
          level: user.level || "",
          nama: user.nama || "",
          telp: user.telp || "",
          email: user.email || "",
          username: user.username || "",
          verifikator: Boolean(user.verifikator) || false,
          delete_foto: false,
        }
      : {
          foto: "",
          level: "",
          nama: "",
          telp: "",
          email: "",
          username: "",
          verifikator: false,
          delete_foto: false,
        },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting, mutate, refetch),
  });

  return (
    <div className="hk-general-settings">
      <form onSubmit={formik.handleSubmit}>
        {/* input foto  */}
        <Box mb={3} className={classes.profileThumb}>
          <ContentLayout title="Foto">
            {!formik.values.delete_foto ? (
              <>
                <Box width="100%" display="flex" alignItems="center">
                  <Box pr={2} className="avatar-thumb">
                    <Thumb
                      altText={formik.values.nama}
                      file={
                        formik.values.file
                          ? formik.values.file
                          : formik.values.foto
                      }
                    />
                  </Box>
                  <Box width="100%">
                    <TextField
                      fullWidth
                      type="file"
                      id="file"
                      name="file"
                      className={classes.fileUpload}
                      onBlur={formik.handleBlur}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "file",
                          event.currentTarget.files[0]
                        );
                      }}
                      inputProps={{ accept: "image/*" }}
                    />
                  </Box>
                </Box>
                <FormHelperText style={{ color: "red" }}>
                  {formik.touched.file && formik.errors.file}
                </FormHelperText>
              </>
            ) : null}

            {user.foto ? (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="delete_foto"
                      checked={formik.values.delete_foto}
                      onChange={(e) => {
                        formik.setFieldValue("delete_foto", e.target.checked);
                        formik.setFieldValue("file", "");
                      }}
                    />
                  }
                  label=" Hapus Foto"
                />
              </FormGroup>
            ) : null}
          </ContentLayout>
        </Box>
        {/* input level  */}
        <Box mb={3}>
          <ContentLayout title="Level User *">
            <FormControl fullWidth>
              <TextField
                disabled
                variant="standard"
                name="level"
                placeholder="Level"
                value={user.level}
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
          <ContentLayout title="Telp / HP *">
            <FormControl fullWidth>
              <TextField
                required
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
              {formik.isSubmitting ? "Memproses ..." : "Simpan"}
            </Button>
          </ContentLayout>
        </Box>
      </form>
    </div>
  );
}

export default UserFormUtama;
