import { useState } from "react";
import Head from "next/head";
import AppConfig from "assets/appConfig";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

// ICON
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";

// MUI
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import { Tabs, Tab } from "@mui/material";

// Components
import SmallTitleBar from "components/GlobalComponents/PageTitleBar/SmallTitleBar";
import CustomCard from "components/GlobalComponents/Card/CustomCard";
import CardUser from "components/GlobalComponents/Card/CardUser";

import UserFormUtama from "components/User/Form/UserFormUtama";
import UserFormUmum from "components/User/Form/UserFormUmum";
import UserFormAlamat from "components/User/Form/UserFormAlamat";
import UserFormBadan from "components/User/Form/UserFormBadan";
import UserFormNomor from "components/User/Form/UserFormNomor";
import UserFormPassword from "components/User/Form/UserFormPassword";

function TabPanel(props) {
  const { children, value, index, dir, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
      dir={dir}
    >
      {value === index && <Box p={{ xs: "12px", sm: 2 }}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

function UserEdit() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue((prev) => newValue);
  };

  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;

  const {
    data: user,
    refetch,
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
      toast.success(data.message || "Sukses");
      queryClient.invalidateQueries(["users"]);
      setTimeout(() => {
        router.push(`/admin/main/user`);
      }, 2000);
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

  if (!user.editable)
    return (
      <Alert
        sx={{ mt: 2 }}
        severity="error"
      >{`Tidak Ada Izin Mengubah User Ini`}</Alert>
    );

  return (
    <>
      <Head>
        <title>{`Edit User - ${AppConfig.brandName}`}</title>
      </Head>

      <SmallTitleBar title={`Edit ${user?.nama}`} center={false} back={true} />

      <Container maxWidth={false}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9}>
            <CustomCard caption={`Formulir Edit Data User`}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab
                    icon={<EngineeringOutlinedIcon />}
                    iconPosition="start"
                    label="Utama"
                    {...a11yProps(0)}
                  />
                  <Tab
                    icon={<PersonSearchOutlinedIcon />}
                    iconPosition="start"
                    label="Informasi Umum"
                    {...a11yProps(1)}
                  />
                  <Tab
                    icon={<HomeOutlinedIcon />}
                    iconPosition="start"
                    label="Alamat"
                    {...a11yProps(2)}
                  />
                  <Tab
                    icon={<PsychologyOutlinedIcon />}
                    iconPosition="start"
                    label="Keterangan Badan"
                    {...a11yProps(3)}
                  />
                  <Tab
                    icon={<PaymentOutlinedIcon />}
                    iconPosition="start"
                    label="Informasi Lainnya"
                    {...a11yProps(4)}
                  />
                  <Tab
                    icon={<LockPersonIcon />}
                    iconPosition="start"
                    label="Keamanan"
                    {...a11yProps(5)}
                  />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <Box pt={3}>
                    <UserFormUtama user={user} refetch={refetch} />
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Box pt={3}>
                    <UserFormUmum user={user} />
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Box pt={3}>
                    <UserFormAlamat user={user} />
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Box pt={3}>
                    <UserFormBadan user={user} />
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <Box pt={3}>
                    <UserFormNomor user={user} />
                  </Box>
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <Box pt={3}>
                    <UserFormPassword user={user} />
                  </Box>
                </TabPanel>
              </Box>
            </CustomCard>
          </Grid>
          <Grid item lg={3}>
            {Object.keys(user).length !== 0 ? (
              <Box pt={3} sx={{ display: { xs: "none", lg: "block" } }}>
                <CardUser
                  data={user}
                  deleteCallback={deleteCallback}
                  url={`/api/user/${user.id}`}
                  queryKey={["user", user.id, "alamat"]}
                  linkDetail={`/admin/main/user`}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

UserEdit.auth = true;
UserEdit.breadcrumb = [
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
    title: "Edit",
  },
];
export default UserEdit;
