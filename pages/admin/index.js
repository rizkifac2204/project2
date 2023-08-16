import Head from "next/head";
import AppConfig from "assets/appConfig";
import axios from "axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
// ICON
import PeopleIcon from "@mui/icons-material/People";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

// Components
import AlertInfo from "components/Dashboard/AlertInfo";

function Dashboard() {
  const { data: main, isFetching: isFetchingMain } = useQuery({
    queryKey: ["dashboard", "main"],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/dashboard/main`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  return (
    <>
      <Head>
        <title>{`Dashboard - ${AppConfig.brandName}`}</title>
      </Head>

      {isFetchingMain && <LinearProgress />}

      <Box sx={{ mx: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AlertInfo />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <CardContent>
                  <Typography component="div" variant="h5">
                    {main?.jumlahUser}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Pengguna
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href="/admin/setting/users">
                    <SettingsSuggestIcon
                      color="secondary"
                      sx={{ cursor: "pointer" }}
                    />
                  </Link>
                </CardActions>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                }}
              >
                <PeopleIcon color="info" sx={{ fontSize: 120 }} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <CardContent>
                  <Typography component="div" variant="h5">
                    {main?.jumlahPemilih}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Pemilih
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href="/admin/dip">
                    <SettingsSuggestIcon
                      color="secondary"
                      sx={{ cursor: "pointer" }}
                    />
                  </Link>
                </CardActions>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                }}
              >
                <DataSaverOnIcon color="primary" sx={{ fontSize: 120 }} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <CardContent>
                  <Typography component="div" variant="h5">
                    {main?.jumlahTps}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    TPS
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href="/admin/survey">
                    <SettingsSuggestIcon
                      color="secondary"
                      sx={{ cursor: "pointer" }}
                    />
                  </Link>
                </CardActions>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                }}
              >
                <DynamicFormIcon color="warning" sx={{ fontSize: 120 }} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <CardContent>
                  <Typography component="div" variant="h5">
                    {main?.jumlahPartai}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Partai
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href="/admin/keberatan">
                    <SettingsSuggestIcon
                      color="secondary"
                      sx={{ cursor: "pointer" }}
                    />
                  </Link>
                </CardActions>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignContent: "center",
                }}
              >
                <FlagOutlinedIcon color="error" sx={{ fontSize: 120 }} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

Dashboard.auth = true;
Dashboard.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
];
export default Dashboard;
