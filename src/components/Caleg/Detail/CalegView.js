import Link from "next/link";

import { makeStyles } from "@mui/styles";
import { Typography, Fab, Box, Divider } from "@mui/material";

// icons
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

//component
import Thumb from "components/GlobalComponents/Thumb";

const useStyles = makeStyles((theme) => ({
  fab: {
    boxShadow: "none",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

function CalegView({ caleg, handleDeleteClick }) {
  const classes = useStyles();
  if (!caleg) return null;

  return (
    <div className="">
      <Box className="user-detail" sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <div className="user-avatar">
            <Thumb file={null} alt={caleg.nama} />
          </div>
        </Box>
        <Typography variant="h6" style={{ marginBottom: "5px" }}>
          {caleg.nama}
        </Typography>
        <Box mb={2} fontSize="subtitle2.fontSize" color="text.secondary">
          {caleg.jenis}
        </Box>

        <Fab
          className={classes.fab}
          size="small"
          aria-label="Edit"
          component={Link}
          href={`/admin/main/caleg/${caleg.id}/edit`}
        >
          <EditOutlinedIcon />
        </Fab>
        <Fab
          className={classes.fab}
          size="small"
          aria-label="delete"
          onClick={handleDeleteClick}
        >
          <DeleteOutlineOutlinedIcon color="primary" />
        </Fab>
      </Box>
      <Divider />
    </div>
  );
}

export default CalegView;
