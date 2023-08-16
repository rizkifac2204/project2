import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// component
import CustomCard from "components/GlobalComponents/Card/CustomCard";

function CalegUmum({ caleg }) {
  return (
    <div>
      <CustomCard
        title={`Informasi Umum`}
        caption="Detail Informasi Umum Caleg"
        showDivider={true}
      >
        <Grid container mt={4}>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle2">Nama Lengkap</Typography>
              <Typography variant="body2">{caleg.nama}</Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2">Caleg</Typography>
              <Typography variant="body2">{caleg?.jenis || "-"}</Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2">Dapil</Typography>
              <Typography variant="body2">{caleg?.dapil || "-"}</Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2">Partai</Typography>
              <Typography variant="body2">{caleg?.partai || "-"}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="subtitle2">Nomor Urut</Typography>
              <Typography variant="body2">
                {caleg?.nomor_urut || "-"}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2">Jenis Kelamin</Typography>
              <Typography variant="body2">
                {caleg?.jenis_kelamin || "-"}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2">Alamat</Typography>
              <Typography variant="body2">{caleg?.alamat || "-"}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CustomCard>
    </div>
  );
}

export default CalegUmum;
