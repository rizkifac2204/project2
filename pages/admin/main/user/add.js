import Head from "next/head";
import AppConfig from "assets/appConfig";
// MUI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// components
import FormUserAdd from "components/User/Form/FormUserAdd";
// import SmallTitleBar from "components/GlobalComponents/PageTitleBar/SmallTitleBar";
import CustomCard from "components/GlobalComponents/Card/CustomCard";

function UserAdd() {
  return (
    <>
      <Head>
        <title>{`Tambah User - ${AppConfig.brandName}`}</title>
      </Head>
      <div>
        {/* <SmallTitleBar title="Tambah Data User" /> */}
        <Container maxWidth="lg">
          <Box className="page-space">
            <CustomCard>
              <FormUserAdd />
            </CustomCard>
          </Box>
        </Container>
      </div>
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
