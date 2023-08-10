import { NextResponse } from "next/server";
import { verifyAuth } from "libs/auth";

export const config = {
  matcher: ["/(admin.*)", "/"],
};

export default async function middleware(req, res) {
  const { pathname, origin } = req.nextUrl;

  const token = req.cookies.get(process.env.JWT_NAME)?.value;
  const verifiedToken = await verifyAuth(token, res).catch((err) => {
    // console.log(err);
  });

  if (pathname === "/")
    if (verifiedToken) return NextResponse.redirect(`${origin}/admin`);

  if (pathname.startsWith("/admin")) {
    if (!verifiedToken) return NextResponse.redirect(`${origin}/login`);

    // limit untuk user TPS
    if (verifiedToken.role === "TPS") {
      // halaman wilayah
      if (pathname.startsWith("/admin/wilayah"))
        return NextResponse.redirect(`${origin}/404`);
      // semua halaman utama
      if (pathname.startsWith("/admin/utama"))
        return NextResponse.redirect(`${origin}/404`);
      // semua halaman pungut hitung
      if (pathname === "/admin/pungut-hitung/user-tps")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/user-tps/add")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/saintelague")
        return NextResponse.redirect(`${origin}/404`);
    }

    // limit untuk user Relawan
    if (verifiedToken.role === "Relawan") {
      if (pathname === "/admin/utama/user/add")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/utama/partai")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/utama/keuangan/manajemen")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/utama/kampanye/add")
        return NextResponse.redirect(`${origin}/404`);
    }
  }

  return NextResponse.next();
}
