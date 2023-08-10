import Skeleton from "@mui/material/Skeleton";
export default function Wait({ loading = false, minHeight = 300 }) {
  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{ minHeight: minHeight }}
      />
    );
  }
  return <></>;
}
