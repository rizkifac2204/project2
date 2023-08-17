import Link from "next/link";

import { Typography, Fab, Box, Divider } from "@mui/material";

// icons
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

//component
import Thumb from "components/GlobalComponents/Thumb";

function CalegView({ caleg, handleDeleteClick }) {
  if (!caleg) return null;

  return (
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

      <Box display="flex" justifyContent="center">
        <Fab
          size="small"
          aria-label="Edit"
          component={Link}
          href={`/admin/main/caleg/${caleg.id}/edit`}
          sx={{ mr: 2 }}
        >
          <EditOutlinedIcon />
        </Fab>

        <Fab size="small" aria-label="delete" onClick={handleDeleteClick}>
          <DeleteOutlineOutlinedIcon color="primary" />
        </Fab>
      </Box>

      <br />

      <Divider />
    </Box>
  );
}

export default CalegView;
