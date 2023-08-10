import { useState, useEffect } from "react";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";

export default function ThumbImage({
  file,
  altText = "Featured Image",
  height,
  className,
  ...others
}) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState(null);
  const [alt, setAlt] = useState(altText);

  useEffect(() => {
    if (!file) return;
    setLoading(true);

    if (typeof file === "object") {
      const reader = new FileReader();
      reader.onloadend = function () {
        setLoading(false);
        setThumb(reader.result);
        setAlt(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      setThumb(`/api/services/file/src/assets/Uploads/${file}`);
      setLoading(false);
    }
  }, [file]);

  if (!file || !thumb) {
    return (
      <Image
        src="/Images/no-image.jpg"
        alt={altText}
        width={120}
        height={120}
        priority
      />
    );
  }

  if (loading) {
    return (
      <Skeleton
        {...(height ? { height: height } : { width: 120, height: 120 })}
        animation="wave"
        variant="rectangular"
      />
    );
  }

  return (
    <Image
      src={thumb}
      alt={alt}
      width={120}
      height={120}
      sizes="(max-width: 250px) 100vw, 120px"
      placeholder="blur"
      blurDataURL="/Images/no-image.jpg"
      onError={(e) => setThumb("/Images/no-image.jpg")}
      className={className ? className : ""}
      {...others}
    />
  );
}
