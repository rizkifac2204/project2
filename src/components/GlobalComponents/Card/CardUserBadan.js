import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// component
import CustomCard from "components/GlobalComponents/Card/CustomCard";
import Wait from "components/GlobalComponents/Wait";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

function CardUserBadan({ data, url, queryKey }) {
  const {
    data: badan,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKey,
    queryFn: ({ signal }) =>
      axios
        .get(url, { signal })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
  });

  if (isLoading) return <Wait loading={true} />;
  if (isError)
    return (
      <Alert
        sx={{ mt: 2 }}
        severity="error"
      >{`An error has occurred: ${error}`}</Alert>
    );

  return (
    <div>
      <CustomCard title={`Keterangan Badan`} showDivider={true}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Tinggi Badan</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.tinggi || "-"} cm
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Berat Badan</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.berat || "-"} kg
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Jenis Rambut</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.jenis_rambut || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>bentuk_wajah</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.bentuk_wajah || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>warna_kulit</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.warna_kulit || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Ukuran Celana</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.ukuran_celana || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Ukuran Baju</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.ukuran_baju || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Ukuran Sepatu</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.ukuran_sepatu || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Ciri Khas</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.ciri_khas || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>Cacat</Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {badan.cacat || "-"}
            </Typography>
          </Item>
        </Box>
      </CustomCard>
    </div>
  );
}

export default CardUserBadan;
