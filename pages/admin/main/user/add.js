import Head from "next/head";
import AppConfig from "assets/appConfig";
// MUI
import Container from "@mui/material/Container";

// components
import SmallTitleBar from "components/GlobalComponents/PageTitleBar/SmallTitleBar";
import FormUserAdd from "components/User/Form/FormUserAdd";
import CustomCard from "components/GlobalComponents/Card/CustomCard";

function UserAdd() {
  return (
    <>
      <Head>
        <title>{`Tambah User - ${AppConfig.brandName}`}</title>
      </Head>

      <SmallTitleBar title="Tambah Data User" />

      <Container maxWidth="lg">
        <CustomCard>
          <FormUserAdd />
        </CustomCard>
      </Container>
    </>
  );
}

UserAdd.auth = true;
UserAdd.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/user",
    title: "User",
  },
  {
    path: "/admin/main/user/add",
    title: "Tambah",
  },
];
export default UserAdd;
