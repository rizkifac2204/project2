import { Typography, Fab, Box, Divider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// icons
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
// utils
import { formatedDate } from "utils/formatDate";

//component
import Wait from "components/GlobalComponents/Wait";
import Thumb from "components/GlobalComponents/Thumb";
import FotoAction from "components/GlobalComponents/FotoAction";

function CardUser({
  data,
  deleteCallback,
  url,
  queryKey,
  isFotoAction,
  linkDetail,
}) {
  const {
    data: alamat,
    isError,
    isLoading,
  } = useQuery({
    queryKey: queryKey,
    queryFn: ({ signal }) =>
      axios
        .get(`${url}/alamat`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  function handleDeleteClick() {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      axios
        .delete(url)
        .then((res) => {
          deleteCallback().onSuccess(res.data);
        })
        .catch((err) => {
          console.log(err);
          deleteCallback().onError(err?.response?.data);
        });
    }
  }

  if (!data) return null;

  return (
    <>
      <Box sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {isFotoAction && <FotoAction profile={data} />}
          <div className="user-avatar">
            <Thumb file={data.foto} alt={data.nama} />
          </div>
        </Box>
        <Typography variant="h6" style={{ marginBottom: "5px" }} align="center">
          {data.verifikator ? (
            <Tooltip title="Verifikator Data">
              <KeyOutlinedIcon color="primary" />
            </Tooltip>
          ) : null}
          {data.nama}
        </Typography>
        <Box
          mb={2}
          fontSize="subtitle2.fontSize"
          color="text.secondary"
          align="center"
        >
          {data.level}
        </Box>
        <Box display="flex" justifyContent="space-between">
          {data?.myself ? (
            <Fab
              size="small"
              aria-label="detail"
              component={Link}
              href={`/admin/profile`}
            >
              <VisibilityOutlinedIcon />
            </Fab>
          ) : (
            <Fab
              size="small"
              aria-label="detail"
              component={Link}
              href={`${linkDetail}/${data.id}`}
            >
              <VisibilityOutlinedIcon />
            </Fab>
          )}

          {data?.editable && !data?.myself && (
            <>
              <Fab
                size="small"
                aria-label="Edit"
                component={Link}
                href={`${linkDetail}/${data.id}/edit`}
              >
                <EditOutlinedIcon />
              </Fab>
              <Fab size="small" aria-label="delete" onClick={handleDeleteClick}>
                <DeleteOutlineOutlinedIcon color="primary" />
              </Fab>
            </>
          )}

          <Fab
            size="small"
            aria-label="telp"
            disabled={!data.telp}
            component={Link}
            href={`tel:${data.telp}`}
          >
            <LocalPhoneOutlinedIcon />
          </Fab>
          <Fab
            size="small"
            aria-label="email"
            disabled={!data.email}
            component={Link}
            href={`mailto:${data.email}`}
          >
            <EmailOutlinedIcon />
          </Fab>
        </Box>
      </Box>
      <Divider />
      <div>
        <Box py={2}>
          <Box mb={2} fontSize="subtitle1.fontSize">
            Informasi Utama
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2">Email</Typography>
            <Typography variant="subtitle2" color="textPrimary">
              {data.email || "-"}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2">Phone No.</Typography>
            <Typography variant="subtitle2" color="textPrimary">
              {data.telp || "-"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Update Terakhir</Typography>
            <Typography variant="subtitle2" color="textPrimary">
              {data.updated_at ? formatedDate(data.updated_at, true) : "-"}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box display="flex" py={2} justifyContent="space-between">
          {isLoading && <Wait loading={true} minHeight={100} />}
          {isError && "An error has occurred"}
          {alamat ? (
            <Typography align="center">
              {alamat.alamat} RT {alamat.rt || "-"} RW {alamat.rw || "-"},
              Kel/Desa. {alamat.kelurahan || "-"}, Kec.{" "}
              {alamat.kecamatan || "-"}, {alamat.kabkota} {alamat.provinsi}
            </Typography>
          ) : null}
        </Box>
        <Divider />
      </div>
    </>
  );
}

export default CardUser;
