import Link from "next/link";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";

import Thumb from "components/GlobalComponents/Thumb";

function UserDetail({ user }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  function handleDelete() {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      axios
        .delete(`/api/user/${user.id}`)
        .then((res) => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          toast.success(res.data.message);
          setTimeout(() => {
            router.push(`/admin/main/user`);
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message);
        });
    }
  }
  return (
    <div className="mod-profile-wrap">
      <Box py={3} className="mod-profile">
        <div
          className="mod-profile-header"
          style={{
            backgroundImage: "url('/Images/banner-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
        <Box className="mod-profile-detail">
          <Box>
            <div className="user-avatar">
              <Thumb file={user.foto} alt={user.nama} />
            </div>
            <Box>
              <Typography variant="h6">{user.nama}</Typography>
              <Typography
                variant="body2"
                className="text-disabled"
                style={{ marginBottom: "5px" }}
              >
                @{user.level || "-"}
              </Typography>
              <div className="mod-profile-meta" style={{ fontSize: "12px" }}>
                <ul>
                  <li>
                    <PhoneAndroidOutlinedIcon fontSize="inherit" />
                    <span>{user.telp || "-"}</span>
                  </li>
                  <li>
                    <MailOutlineOutlinedIcon fontSize="inherit" />
                    <span>{user.email || "-"}</span>
                  </li>
                </ul>
              </div>
              <div className="mod-profile-meta mod-profile-meta--followers ">
                <ul>
                  {user.verifikator ? (
                    <li>
                      <Tooltip title="Verifikator Data">
                        <Typography variant="h6" className="mr-1">
                          <KeyOutlinedIcon fontSize="small" />{" "}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body2">Verifikator Data</Typography>
                    </li>
                  ) : null}
                </ul>
              </div>
            </Box>
          </Box>
          {user.editable && !user.myself && (
            <Box className="user-detail--btn text-right">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                sx={{ mr: 1 }}
                component={Link}
                href={`/admin/main/user/${user.id}/edit`}
              >
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleDelete}
              >
                Hapus
              </Button>
            </Box>
          )}
          {user.myself && (
            <Box className="user-detail--btn text-right">
              <Button
                size="small"
                variant="outlined"
                color="primary"
                component={Link}
                href={`/admin/profile/setting`}
              >
                Update
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default UserDetail;
