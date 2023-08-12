import DashboardIcon from "@mui/icons-material/Dashboard";
import DataArrayIcon from "@mui/icons-material/DataArray";
import AddIcon from "@mui/icons-material/Add";
import Groups3OutlinedIcon from "@mui/icons-material/Groups3Outlined";
import FlagCircleOutlinedIcon from "@mui/icons-material/FlagCircleOutlined";
import SensorOccupiedOutlinedIcon from "@mui/icons-material/SensorOccupiedOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import MotionPhotosAutoOutlinedIcon from "@mui/icons-material/MotionPhotosAutoOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

export const mainRoutes = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon />,
  },
  {
    title: "User",
    icon: <Groups3OutlinedIcon />,
    children: [
      {
        title: "Data User",
        path: "/admin/main/user",
        icon: <DataArrayIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3, 4],
      },
      {
        title: "Tambah User",
        path: "/admin/main/user/add",
        icon: <AddIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3],
      },
    ],
  },
  {
    title: "Partai",
    path: "/admin/main/partai",
    icon: <FlagCircleOutlinedIcon />,
    limit: [1, 2, 3, 4],
  },
  {
    title: "Caleg",
    icon: <SensorOccupiedOutlinedIcon />,
    children: [
      {
        title: "Data Caleg",
        path: "/admin/main/caleg",
        icon: <DataArrayIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3, 4],
      },
      {
        title: "Tambah Caleg",
        path: "/admin/main/caleg/add",
        icon: <AddIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3],
      },
    ],
  },
];

export const wilayahRoutes = [
  {
    title: "Wilayah",
    path: "/admin/wilayah",
    icon: <PinDropOutlinedIcon />,
    limit: [1, 2, 3],
  },
];

export const putungRoutes = [
  {
    title: "User TPS",
    icon: <Groups3OutlinedIcon />,
    children: [
      {
        title: "Data User TPS",
        path: "/admin/pungut-hitung/user-tps",
        icon: <DataArrayIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3, 4],
      },
      {
        title: "Tambah User",
        path: "/admin/pungut-hitung/user-tps/add",
        icon: <AddIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3, 4],
      },
      {
        title: "Generate User",
        path: "/admin/pungut-hitung/user-tps/generate",
        icon: <MotionPhotosAutoOutlinedIcon sx={{ fontSize: 12 }} />,
        limit: [1, 2, 3, 4],
      },
    ],
  },
  {
    title: "Sante Lague",
    path: "/admin/pungut-hitung/sainte-lague",
    icon: <EventSeatOutlinedIcon />,
    limit: [1, 2, 3],
  },
  {
    title: "Formulir",
    icon: <TextSnippetOutlinedIcon />,
    children: [
      {
        title: "C-Hasil DPR",
        path: "/admin/pungut-hitung/formulir/dpr",
        icon: <DocumentScannerOutlinedIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "C-Hasil DPR",
        path: "/admin/pungut-hitung/formulir/dpd",
        icon: <DocumentScannerOutlinedIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "C-Hasil DPRD Provinsi",
        path: "/admin/pungut-hitung/formulir/dprd-provinsi",
        icon: <DocumentScannerOutlinedIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "C-Hasil DPRD Kabupaten/Kota",
        path: "/admin/pungut-hitung/formulir/dprd-kabkota",
        icon: <DocumentScannerOutlinedIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "C-Hasil Presiden",
        path: "/admin/pungut-hitung/formulir/presiden",
        icon: <DocumentScannerOutlinedIcon sx={{ fontSize: 12 }} />,
      },
    ],
  },
];

export const supportRoutes = [
  {
    title: "Catatan",
    icon: <SpeakerNotesOutlinedIcon />,
    children: [
      {
        title: "Catatan Pribadi",
        path: "/admin/support/notes",
        icon: <CommentOutlinedIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "Catatan Publik",
        path: "/admin/support/notes/publik",
        icon: <CommentOutlinedIcon sx={{ fontSize: 12 }} />,
      },
    ],
  },
];
