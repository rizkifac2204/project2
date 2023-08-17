import Head from "next/head";
import AppConfig from "assets/appConfig";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// MUI
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// ICON
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LockPersonIcon from "@mui/icons-material/LockPerson";

//Component
import ProfileFormUtama from "components/Profile/Form/ProfileFormUtama";
import ProfileFormUmum from "components/Profile/Form/ProfileFormUmum";
import ProfileFormAlamat from "components/Profile/Form/ProfileFormAlamat";
import ProfileFormBadan from "components/Profile/Form/ProfileFormBadan";
import ProfileFormNomor from "components/Profile/Form/ProfileFormNomor";
import ProfileFormPassword from "components/Profile/Form/ProfileFormPassword";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ProfileSetting() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        <title>{`Setting Profile - ${AppConfig.brandName}`}</title>
      </Head>

      <Container maxWidth={false}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
        </Box>

        <TabPanel value={value} index={0}>
          <Box pt={3}>
            <ProfileFormUtama />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box pt={3}>
            <ProfileFormUmum />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box pt={3}>
            <ProfileFormAlamat />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Box pt={3}>
            {profile?.level !== 5 ? (
              <ProfileFormBadan />
            ) : (
              <Alert severity="info">Tidak Tersedia</Alert>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Box pt={3}>
            {profile?.level !== 5 ? (
              <ProfileFormNomor />
            ) : (
              <Alert severity="info">Tidak Tersedia</Alert>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Box pt={3}>
            <ProfileFormPassword />
          </Box>
        </TabPanel>
      </Container>
    </>
  );
}

ProfileSetting.auth = true;
ProfileSetting.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/profile",
    title: "Profile",
  },
  {
    path: "/admin/profile/setting",
    title: "Pengaturan",
  },
];
export default ProfileSetting;
