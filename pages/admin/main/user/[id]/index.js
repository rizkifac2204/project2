// lybrary
import Head from "next/head";
import appConfig from "assets/appConfig";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import CardUser from "components/GlobalComponents/Card/CardUser";
import CardUserUmum from "components/GlobalComponents/Card/CardUserUmum";
import CardUserBadan from "components/GlobalComponents/Card/CardUserBadan";
import CardUserNomor from "components/GlobalComponents/Card/CardUserNomor";

function UserView() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: user,
    isError,
    isLoading,
    error,
  } = useQuery({
    enabled: !!id,
    queryKey: ["user", id],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/user/${id}`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  function deleteCallback() {
    function onSuccess(data) {
      toast.success(data.message || "Berhasil Hapus");
      setTimeout(() => {
        router.push(`/admin/main/user`);
      }, 500);
    }

    function onError(err) {
      toast.error(err.message);
    }

    return { onSuccess, onError };
  }

  if (isLoading) return <LinearProgress sx={{ height: "4px" }} />;
  if (isError)
    return (
      <Alert
        sx={{ mt: 2 }}
        severity="error"
      >{`An error has occurred: ${error.message}`}</Alert>
    );

  return (
    <>
      <Head>
        <title>{`Detail User -  ${appConfig.brandName}`}</title>
      </Head>
      <Container maxWidth={false}>
        <Box className="page-space">
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <CardUser
                data={user}
                deleteCallback={deleteCallback}
                url={`/api/user/${user.id}`}
                queryKey={["user", user.id, "alamat"]}
                linkDetail={`/admin/main/user`}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Box display="flex" flexDirection="column">
                <Box mb={3}>
                  <CardUserUmum
                    data={user}
                    url={`/api/user/${user.id}`}
                    queryKey={["user", user.id, "umum"]}
                  />
                </Box>
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <CardUserBadan
                        data={user}
                        url={`/api/user/${user.id}/badan`}
                        queryKey={["user", user.id, "badan"]}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CardUserNomor
                        data={user}
                        url={`/api/user/${user.id}/nomor`}
                        queryKey={["user", user.id, "nomor"]}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

UserView.auth = true;
UserView.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/user",
    title: "User",
  },
  {
    path: "/admin/main/user",
    title: "Detail",
  },
];
export default UserView;
