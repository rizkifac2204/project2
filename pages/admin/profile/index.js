import Head from "next/head";
import AppConfig from "assets/appConfig";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

//Component
import CardUser from "components/GlobalComponents/Card/CardUser";
import CardUserUmum from "components/GlobalComponents/Card/CardUserUmum";
import CardUserBadan from "components/GlobalComponents/Card/CardUserBadan";
import CardUserNomor from "components/GlobalComponents/Card/CardUserNomor";

function Profile() {
  const {
    data: profile,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/profile`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

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
        <title>{`Profile - ${AppConfig.brandName}`}</title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <CardUser
              data={{ ...profile, myself: true }}
              url={`/api/profile`}
              queryKey={["profile", "alamat"]}
              isFotoAction={true}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box display="flex" flexDirection="column">
              <Box mb={3}>
                <CardUserUmum
                  data={profile}
                  url={`/api/profile`}
                  queryKey={["profile", "umum"]}
                />
              </Box>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CardUserBadan
                      data={profile}
                      url={`/api/profile/badan`}
                      queryKey={["profile", "badan"]}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CardUserNomor
                      data={profile}
                      url={`/api/profile/nomor`}
                      queryKey={["profile", "nomor"]}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

Profile.auth = true;
Profile.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/profile",
    title: "Profile",
  },
];
export default Profile;
