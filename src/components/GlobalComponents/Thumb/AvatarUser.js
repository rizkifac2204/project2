import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";

export default function AvatarUser({
  file,
  altText = "User",
  path,
  ...others
}) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState("/Images/avatar-4.jpg");

  useEffect(() => {
    if (file) {
      setLoading(true);
      const url = `/api/services/file/src/assets/Uploads/${
        path ? path : "foto"
      }/${file}`;
      axios
        .get(url, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const buffer64 = Buffer.from(res.data, "binary").toString("base64");
          setThumb(`data:${res.headers["content-type"]};base64, ${buffer64}`);
        })
        .catch((err) => {
          console.log(err.response);
        })
        .then(() => setLoading(false));
    }
  }, [file]);

  if (!file) return <Avatar alt={altText} src={thumb} {...others} />;

  if (loading) return <Skeleton variant="circular" width={44} height={44} />;

  return <Avatar alt={altText} src={thumb} {...others} />;
}
