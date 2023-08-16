import { Fragment } from "react";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
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
                  <div className="contact-grid-action">
                    <CalegAksi
                      caleg={caleg}
                      handleDeleteClick={handleDeleteClick}
                    />
                  </div>

                  <AvatarUser
                    file={null}
                    alt={caleg.nama}
                    style={{ width: 100, height: 100, marginBottom: 10 }}
                  />
                  <div className="contact-grid-content">
                    <Box
                      fontSize="subtitle1.fontSize"
                      fontWeight="h6.fontWeight"
                      mt={3}
                    >
                      {caleg.nama}
                    </Box>
                    <Typography variant="subtitle2">{caleg?.partai}</Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        component="span"
                        pr="5px"
                        color="text.secondary"
                        fontSize="body1.fontSize"
                        className="icon fas fa-street-view"
                      ></Box>
                      <Typography variant="subtitle2">
                        {caleg?.alamat || "-"}
                      </Typography>
                    </Box>
                  </div>
                </CardContent>
                <CardActions disableSpacing className="footer-icon">
                  <IconButton size="small">
                    <Icon style={{ fontSize: 20 }}>
                      {caleg?.jenis_kelamin === "perempuan" ? "female" : "male"}
                    </Icon>
                  </IconButton>
                  <IconButton size="small">
                    <Typography variant="caption">
                      No. {caleg?.nomor_urut || "-"}
                    </Typography>
                  </IconButton>
                  <IconButton size="small">
                    <Typography variant="caption">
                      Dapil {caleg?.dapil || "-"}
                    </Typography>
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Fragment>
      ))}
    </Grid>
  );
}
