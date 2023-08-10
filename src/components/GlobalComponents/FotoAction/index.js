import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

// icons
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";

const Input = styled("input")({
  display: "none",
});

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function FotoAction({ profile }) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const filename = `${profile.id}_${file.name}`;
    const formData = new FormData();
    formData.append("file", file, filename);
    formData.append("id", profile.id);
    setIsUploading(true);
    axios
      .post(`/api/profile/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          destinationfile: "foto",
        },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .then((res) => {
        setIsUploading(false);
        setProgress(0);
      });
  };
  const deleteFile = () => {
    const ask = confirm("Yakin Hapus File Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/profile/upload`, {
          params: {
            id: profile.id,
            file: profile.foto,
          },
        })
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };
  const changeFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const filename = `${profile.id}_${file.name}`;
    const formData = new FormData();
    formData.append("file", file, filename);
    formData.append("id", profile.id);
    formData.append("foto", profile.foto);
    setIsUploading(true);
    axios
      .put(`/api/profile/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          destinationfile: "foto",
        },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      })
      .then((res) => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .then((res) => {
        setIsUploading(false);
        setProgress(0);
      });
  };

  if (!profile.foto)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {!isUploading && (
          <label htmlFor={`file` + profile.id}>
            <Input
              id={`file` + profile.id}
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
            <Tooltip title="Upload Foto">
              <IconButton aria-label="upload" size="small" component="span">
                <PhotoCameraOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </label>
        )}
        {isUploading && <CircularProgressWithLabel value={progress} />}
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {!isUploading && (
        <label htmlFor={`file` + profile.id}>
          <Input
            id={`file` + profile.id}
            type="file"
            accept="image/*"
            onChange={changeFile}
          />
          <Tooltip title="Ganti Foto">
            <IconButton aria-label="upload" size="small" component="span">
              <ChangeCircleOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </label>
      )}
      {isUploading && <CircularProgressWithLabel value={progress} />}
      <Tooltip title="Hapus Foto">
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => deleteFile()}
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default FotoAction;
