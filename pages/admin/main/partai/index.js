import Head from "next/head";
import AppConfig from "assets/appConfig";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// MUI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
// ICON
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// components
import CustomCard from "components/GlobalComponents/Card/CustomCard";
import { CustomToolbar } from "components/GlobalComponents/TableComponents";
import PartaiFormAdd from "components/Partai/PartaiFormAdd";
import PartaiFormEdit from "components/Partai/PartaiFormEdit";

function DetailSection({ detail, handleClose }) {
  return (
    <>
      <DialogContent>
        Nomor : <b>{detail?.nomor}</b> <br />
        Partai : <b>{detail?.partai}</b> <br />
        Warna Identitas : <BoxColor code={detail.code_warna} />
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Button onClick={handleClose} autoFocus>
          Tutup
        </Button>
      </DialogActions>
    </>
  );
}

async function deleteData(id) {
  if (id) {
    try {
      const res = await axios.delete(`/api/partai/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || "Terjadi Kesalahan");
    }
  }
}

function BoxColor({ code }) {
  return (
    <Box
      sx={{
        border: 0.5,
        borderColor: "#696D70",
        width: `100%`,
        height: 30,
        backgroundColor: code,
      }}
    />
  );
}

function Partai() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("");
  const [detail, setDetail] = useState({});

  const handleOpen = (data, section) => {
    setSection((prev) => section);
    setDetail((prev) => data);
    setTimeout(() => {
      setOpen(true);
    });
  };
  const handleClose = () => {
    setDetail({});
    setSection("");
    setTimeout(() => {
      setOpen(false);
    });
  };

  const {
    data: partais,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["partais"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/partai`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation({
    mutationFn: deleteData,
    onSuccess: (data, variable, context) => {
      toast.success(data.message || "Sukses");
      queryClient.invalidateQueries(["partais"]);
    },
    onError: (err, variables) => {
      toast.error(err.message);
    },
  });

  const handleDeleteClick = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      mutateDelete(id);
    }
  };

  const columns = [
    {
      field: "nomor",
      headerName: "Nomor",
    },
    {
      field: "partai",
      headerName: "Nama Partai",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "code_warna",
      headerName: "Warna Identitas",
      width: 180,
      renderCell: (params) => <BoxColor code={params.value} />,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      getActions: (values) => {
        return [
          <GridActionsCellItem
            key={1}
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => handleOpen(values.row, "detail")}
          />,
          <GridActionsCellItem
            key={2}
            icon={<EditOutlinedIcon />}
            label="Edit"
            onClick={() => handleOpen(values.row, "edit")}
          />,
          <GridActionsCellItem
            key={3}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(values.id)}
          />,
        ];
      },
    },
  ];

  if (isError)
    return (
      <Alert sx={{ mt: 2 }} severity="error">{`An error has occurred: ${
        error?.message || "Terjadi Kesalahan"
      }`}</Alert>
    );

  return (
    <>
      <Head>
        <title>{`Partai - ${AppConfig.brandName}`}</title>
      </Head>

      {isLoadingDelete && <LinearProgress sx={{ height: "4px" }} />}

      <Container maxWidth={false}>
        <PartaiFormAdd />
        <CustomCard>
          <DataGrid
            autoHeight
            slots={{
              toolbar: CustomToolbar,
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 20, 30, 50]}
            loading={isLoading}
            rows={partais ? partais : []}
            columns={columns}
          />
        </CustomCard>
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {Object.keys(detail).length !== 0 ? (
          section == "detail" ? (
            <DetailSection detail={detail} handleClose={handleClose} />
          ) : (
            <PartaiFormEdit
              detail={detail}
              handleClose={handleClose}
              refetch={refetch}
            />
          )
        ) : null}
      </Dialog>
    </>
  );
}

Partai.auth = true;
Partai.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/partai",
    title: "Partai",
  },
];
export default Partai;
