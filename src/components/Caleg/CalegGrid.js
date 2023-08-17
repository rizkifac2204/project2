import { Fragment } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// component
import CalegAksi from "./CalegAksi";
import AvatarUser from "components/GlobalComponents/Thumb/AvatarUser";

export default function CalegGrid(props) {
  const { calegs, handleDeleteClick } = props;

  return (
    <Grid container spacing={2}>
      {calegs?.pages.map((group, i) => (
        <Fragment key={i}>
          {group.data.map((caleg, index) => (
            <Grid item xs={12} sm={4} lg={3} key={index}>
              <Card>
                <CardContent>
                  <CalegAksi
                    caleg={caleg}
                    handleDeleteClick={handleDeleteClick}
                  />

                  <AvatarUser
                    file={null}
                    alt={caleg.nama}
                    style={{ width: 100, height: 100, margin: "0 auto" }}
                  />

                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Box
                      fontSize="subtitle1.fontSize"
                      fontWeight="h6.fontWeight"
                      mt={3}
                    >
                      {caleg.nama}
                    </Box>

                    <Box>
                      <Typography variant="subtitle2">
                        {caleg?.partai}
                      </Typography>
                    </Box>

                    <Box
                      component="span"
                      pr="5px"
                      color="text.secondary"
                      fontSize="body1.fontSize"
                    >
                      {caleg?.alamat || "-"}
                    </Box>
                  </Box>
                </CardContent>

                <Box
                  display="flex"
                  justifyContent="space-around"
                  flexDirection="center"
                >
                  <Box>
                    <IconButton size="small">
                      <Icon style={{ fontSize: 20 }}>
                        {caleg?.jenis_kelamin === "perempuan"
                          ? "female"
                          : "male"}
                      </Icon>
                    </IconButton>
                  </Box>

                  <Box>
                    <IconButton size="small">
                      <Typography variant="caption">
                        No. {caleg?.nomor_urut || "-"}
                      </Typography>
                    </IconButton>
                  </Box>

                  <Box>
                    <IconButton size="small">
                      <Typography variant="caption">
                        Dapil {caleg?.dapil || "-"}
                      </Typography>
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Fragment>
      ))}
    </Grid>
  );
}
