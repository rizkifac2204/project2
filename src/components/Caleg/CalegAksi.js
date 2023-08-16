import { useState } from "react";
import { useRouter } from "next/router";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

export default function CalegAksi({ caleg, handleDeleteClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        size="small"
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizOutlinedIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          key={"Detail"}
          onClick={() => {
            router.push(`/admin/main/caleg/${caleg.id}`);
          }}
        >
          {"Detail"}
        </MenuItem>
        <MenuItem
          key={"Edit"}
          onClick={() => {
            router.push(`/admin/main/caleg/${caleg.id}/edit`);
          }}
        >
          {"Edit"}
        </MenuItem>
        <MenuItem
          key={"Delete"}
          onClick={() => {
            handleClose();
            handleDeleteClick(caleg.id);
          }}
        >
          {"Hapus"}
        </MenuItem>
      </Menu>
    </div>
  );
}
