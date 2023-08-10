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

function CardUserNomor({ data, url, queryKey }) {
  const {
    data: nomor,
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
      <CustomCard title={`Nomor-nomor`} showDivider={true}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>KTP </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_ktp || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>NIP </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_nip || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>KARPEG </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_karpeg || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>BPJS Ketenagakerjaan </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_bpjs_ketenagakerjaan || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>BPJS Kesehatan </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_bpjs_kesehatan || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>TASPEN </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_taspen || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>KARIS </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_karis || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>NPWP </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_npwp || "-"}
            </Typography>
          </Item>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Item>KONTRAK </Item>
          <Item>
            <Typography variant="subtitle2" align="right">
              {nomor.no_kontrak || "-"}
            </Typography>
          </Item>
        </Box>
      </CustomCard>
    </div>
  );
}

export default CardUserNomor;
