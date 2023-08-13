import { useState, useEffect } from "react";
import Head from "next/head";
import AppConfig from "assets/appConfig";
import { useRouter } from "next/router";
// library
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import {
  DataGrid,
  GridActionsCellItem,
  GridLogicOperator,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
// ICON
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// components
import { CustomToolbar } from "components/GlobalComponents/TableComponents";
import CustomCard from "components/GlobalComponents/Card/CustomCard";
import CardUser from "components/GlobalComponents/Card/CardUser";

async function deleteData(id) {
  if (id) {
    try {
      const res = await axios.delete(`/api/user/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || "Terjadi Kesalahan");
    }
  }
}

function User() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const hideOnLg = useMediaQuery(theme.breakpoints.up("lg"));

  const {
    data: users,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/user`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  const [detail, setDetail] = useState({});
  useEffect(() => {
    if (!users || users.length === 0) return;
    setDetail(users[0]);
  }, [users]);

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation({
    mutationFn: deleteData,
    onSuccess: (data, variable, context) => {
      toast.success(data.message || "Sukses");
      queryClient.invalidateQueries(["users"]);
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

  function deleteCallback() {
    function onSuccess(data) {
      toast.success(data.message || "Sukses");
      queryClient.invalidateQueries(["users"]);
    }

    function onError(err) {
      toast.error(err.message);
    }

    return { onSuccess, onError };
  }

  if (isError)
    return (
      <Alert
        sx={{ mt: 2 }}
        severity="error"
      >{`An error has occurred: ${error.message}`}</Alert>
    );

  const columns = [
    {
      field: "nama",
      headerName: "Nama",
      minWidth: 180,
    },
    {
      field: "level",
      headerName: "Role",
      minWidth: 180,
    },
    {
      field: "telp",
      headerName: "Telp/HP",
      width: 180,
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      hide: hideOnLg,
      getActions: (values) => {
        if (values.row.myself) {
          return [
            <GridActionsCellItem
              key={0}
              icon={<VisibilityIcon />}
              label="Profile"
              onClick={() => router.push("/admin/profile")}
            />,
          ];
        }
        if (values.row.editable) {
          return [
            <GridActionsCellItem
              key={1}
              icon={<VisibilityIcon />}
              label="Detail"
              onClick={() => router.push(`/admin/main/user/${values.id}`)}
            />,
            <GridActionsCellItem
              key={2}
              icon={<EditOutlinedIcon />}
              label="Edit"
              onClick={() => router.push(`/admin/main/user/${values.id}/edit`)}
            />,
            <GridActionsCellItem
              key={3}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDeleteClick(values.id)}
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              key={4}
              icon={<VisibilityIcon />}
              label="Detail"
              onClick={() => router.push(`/admin/main/user/${values.id}`)}
            />,
          ];
        }
      },
    },
  ];

  return (
    <>
      <Head>
        <title>{`User - ${AppConfig.brandName}`}</title>
      </Head>
      <Container maxWidth={false}>
        {isLoadingDelete && <LinearProgress sx={{ height: "4px" }} />}
        <Box className="page-space">
          <Grid container spacing={2}>
            <Grid item lg={3}>
              {Object.keys(detail).length !== 0 ? (
                <Box pt={3} sx={{ display: { xs: "none", lg: "block" } }}>
                  <CardUser
                    data={detail}
                    deleteCallback={deleteCallback}
                    url={`/api/user/${detail.id}`}
                    queryKey={["user", detail.id, "alamat"]}
                    linkDetail={`/admin/main/user`}
                  />
                </Box>
              ) : null}
            </Grid>
            <Grid item xs={12} lg={9}>
              <CustomCard>
                <DataGrid
                  autoHeight
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  slotProps={{
                    toolbar: {
                      multiSearch: true,
                    },
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                    filter: {
                      filterModel: {
                        items: [],
                        quickFilterLogicOperator: GridLogicOperator.Or,
                      },
                    },
                  }}
                  pageSizeOptions={[10, 20, 30, 50]}
                  loading={isLoading}
                  rows={users ? users : []}
                  columns={columns}
                  onRowClick={({ row }) => setDetail(row)}
                />
              </CustomCard>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

User.auth = true;
User.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/user",
    title: "User",
  },
];
export default User;
