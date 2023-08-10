import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function Thumb({ file, altText = "User" }) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState("/Images/avatar-4.jpg");
  const [alt, setAlt] = useState(altText);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    setThumb("/Images/avatar-4.jpg");

    const loadImage = (url, alt) => {
      axios
        .get(url, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const buffer64 = Buffer.from(res.data, "binary").toString("base64");
          setThumb(`data:${res.headers["content-type"]};base64, ${buffer64}`);
          setAlt(alt);
        })
        .catch((err) => {
          console.log(err.response);
        })
        .finally(() => setLoading(false));
    };

    if (typeof file === "object") {
      const reader = new FileReader();
      reader.onloadend = function () {
        setLoading(false);
        setThumb(reader.result);
        setAlt(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      const url = `/api/services/file/src/assets/Uploads/foto/${file}`;
      loadImage(url, altText);
    }
  }, [file, altText]);

  if (!file)
    return (
      <Image
        src={`/Images/avatar-4.jpg`}
        alt={"Akun"}
        width={120}
        height={120}
        priority
      />
    );

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Skeleton variant="circular" width={120} height={120} />
      </Box>
    );

  return <Image src={thumb} alt={alt} width={120} height={120} priority />;
}
