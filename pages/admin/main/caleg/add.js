import Head from "next/head";
import AppConfig from "assets/appConfig";
// MUI
import Container from "@mui/material/Container";

// components
import CalegFormAdd from "components/Caleg/Form/CalegFormAdd";
import SmallTitleBar from "components/GlobalComponents/PageTitleBar/SmallTitleBar";
import CustomCard from "components/GlobalComponents/Card/CustomCard";

function CalegAdd() {
  return (
    <>
      <Head>
        <title>{`Tambah Data Caleg - ${AppConfig.brandName}`}</title>
      </Head>

      <SmallTitleBar title="Tambah Data Caleg" />

      <Container maxWidth={false}>
        <CustomCard
          title={`Formulir Tambah Caleg`}
          caption={`Isi Data Pada Formulir Berikut`}
          showDivider={true}
        >
          <CalegFormAdd />
        </CustomCard>
      </Container>
    </>
  );
}

CalegAdd.auth = true;
CalegAdd.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/caleg",
    title: "Caleg",
  },
  {
    path: "/admin/main/caleg/add",
    title: "Tambah",
  },
];
export default CalegAdd;
