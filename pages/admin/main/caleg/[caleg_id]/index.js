import Head from "next/head";
import AppConfig from "assets/appConfig";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import CalegView from "components/Caleg/Detail/CalegView";
import CalegUmum from "components/Caleg/Detail/CalegUmum";
import CalegSuara from "components/Caleg/Detail/CalegSuara";

function CalegDetail() {
  const router = useRouter();
  const { caleg_id } = router.query;
  const queryClient = useQueryClient();

  const {
    data: caleg,
    isError,
    isLoading,
    error,
  } = useQuery({
    enabled: !!caleg_id,
    queryKey: ["caleg", caleg_id],
    queryFn: ({ signal }) =>
      axios
        .get(`/api/caleg/${caleg_id}`, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  function handleDeleteClick() {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      axios
        .delete(`/api/caleg/${caleg_id}`)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ["calegs", "perpage"] });
          toast.success(res.data.message);
          setTimeout(() => {
            router.push(`/admin/main/caleg`);
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
    }
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
        <title>{`Detail Caleg -  ${AppConfig.brandName}`}</title>
      </Head>

      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <CalegView caleg={caleg} handleDeleteClick={handleDeleteClick} />
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <CalegUmum caleg={caleg} />
          </Grid>
          <Grid item xs={12} sm={12} md={3}>
            <CalegSuara caleg={caleg} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

CalegDetail.auth = true;
CalegDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/caleg",
    title: "Caleg",
  },
  {
    path: "/admin/main/caleg",
    title: "Detail",
  },
];
export default CalegDetail;
