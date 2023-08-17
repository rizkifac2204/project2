import Head from "next/head";
import AppConfig from "assets/appConfig";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

// MUI
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

// components
import SmallTitleBar from "components/GlobalComponents/PageTitleBar/SmallTitleBar";
import CalegData from "components/Caleg/CalegData";
import CalegConfirm from "components/Caleg/CalegConfirm";

const JENIS_DCT = process.env.NEXT_PUBLIC_JENIS_DCT.split(",");

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function Caleg() {
  const confirmRef = useRef();
  const theme = useTheme();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [utils, setUtils] = useState({
    filter: "",
    param: JENIS_DCT[0],
    gridView: true,
    openConfirm: false,
    confirm: false,
    currentId: null,
  });

  const handleChange = (event, newValue) => {
    setValue((prev) => newValue);
    setUtils((prev) => ({ ...prev, param: JENIS_DCT[newValue] }));
    router.push(
      {
        pathname: "/admin/main/caleg",
        query: { jenis: encodeURI(JENIS_DCT[newValue]) },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (router.query?.jenis) {
      const index = JENIS_DCT.indexOf(router.query.jenis);
      if (index !== -1) {
        setUtils((prev) => ({ ...prev, param: JENIS_DCT[index] }));
        setValue((prev) => index);
      }
    }
  }, [router.query.jenis]);

  return (
    <>
      <Head>
        <title>{`Data Caleg - ${AppConfig.brandName}`}</title>
      </Head>

      <SmallTitleBar title={`Data Calon Tetap`} center={false} />

      <Container maxWidth={false}>
        <Box display={{ sm: "flex" }} justifyContent="flex-end" mb={2}>
          <Box>
            <FormControl fullWidth>
              <Input
                type="text"
                placeholder="Cari Data"
                value={utils.filter}
                onChange={(e) =>
                  setUtils((prev) => ({
                    ...prev,
                    filter: e.target.value,
                  }))
                }
                startAdornment={
                  <InputAdornment position="start">
                    {utils.filter ? (
                      <IconButton
                        size="small"
                        onClick={() =>
                          setUtils((prev) => ({
                            ...prev,
                            filter: "",
                          }))
                        }
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    ) : null}
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box ml={3}>
            <IconButton
              color={utils.gridView === true ? "primary" : ""}
              onClick={() => setUtils((prev) => ({ ...prev, gridView: true }))}
            >
              <Icon>apps</Icon>
            </IconButton>
            <IconButton
              color={utils.gridView === false ? "primary" : ""}
              onClick={() => setUtils((prev) => ({ ...prev, gridView: false }))}
            >
              <Icon>view_list</Icon>
            </IconButton>
          </Box>
        </Box>

        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons={"auto"}
          aria-label="scrollable auto tabs example"
        >
          {JENIS_DCT.map((item, index) => (
            <Tab key={index} label={item} {...a11yProps(item)} />
          ))}
        </Tabs>

        {JENIS_DCT.map((item, index) => (
          <TabPanel
            key={index}
            dir={theme.direction}
            value={value}
            index={index}
          >
            <CalegData key={index} utils={utils} setUtils={setUtils} />
          </TabPanel>
        ))}
      </Container>

      <CalegConfirm
        innerRef={confirmRef}
        open={utils.openConfirm}
        setUtils={setUtils}
      />
    </>
  );
}

Caleg.auth = true;
Caleg.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/main/caleg",
    title: "Caleg",
  },
];

export default Caleg;
