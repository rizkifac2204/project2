import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AppConfig from "assets/appConfig";

export default function Footer(props) {
  return (
    <Typography
      sx={{ pt: 3 }}
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      <Link color="inherit" href={AppConfig.brandLink} target={`_blank`}>
        {AppConfig.copyRightText}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
