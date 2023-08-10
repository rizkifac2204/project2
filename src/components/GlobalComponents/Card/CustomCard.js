import { Card, CardContent, Typography, Divider } from "@mui/material";

function CustomCard({
  children,
  cardClasses,
  title = null,
  showDivider = false,
  caption = null,
  ...others
}) {
  return (
    <Card
      sx={{
        p: "1.25rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        borderRadius: "0.625rem",
        ...others,
      }}
      className={`${cardClasses ? cardClasses : ""}`}
    >
      {title ? <Typography variant="h6">{title}</Typography> : null}
      {caption ? <Typography variant="caption">{caption}</Typography> : null}
      {showDivider ? <Divider /> : null}
      {children}
    </Card>
  );
}

export default CustomCard;
