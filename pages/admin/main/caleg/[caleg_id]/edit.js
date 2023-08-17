import Head from "next/head";
import AppConfig from "assets/appConfig";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// MUI
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";

// components
import CalegFormEdit from "components/Caleg/Form/CalegFormEdit";
import SmallTitleBar from "components/GlobalComponents/PageTitleBar/SmallTitleBar";
import CustomCard from "components/GlobalComponents/Card/CustomCard";

function CalegEdit() {
  const router = useRouter();
  const { caleg_id } = router.query;

  const {
    data: caleg,
    refetch,
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
        <title>{`Edit Data Caleg - ${AppConfig.brandName}`}</title>
      </Head>

      <SmallTitleBar title="Edit Data Caleg" center={false} back={true} />

      <Container maxWidth={false}>
        <CustomCard
          title={`Formulir Edit Caleg`}
          caption={`Isi Data Pada Formulir Berikut`}
          showDivider={true}
        >
          <CalegFormEdit caleg={caleg} refetch={refetch} />
        </CustomCard>
      </Container>
    </>
  );
}

CalegEdit.auth = true;
CalegEdit.breadcrumb = [
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
    title: "Edit",
  },
];
export default CalegEdit;
