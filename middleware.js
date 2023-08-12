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

  if (pathname === "/login") return NextResponse.redirect(`${origin}/`);

  if (pathname === "/")
    if (verifiedToken) return NextResponse.redirect(`${origin}/admin`);

  if (pathname.startsWith("/admin")) {
    if (!verifiedToken) return NextResponse.redirect(`${origin}/`);

    // limit untuk user Relawan
    if (verifiedToken.role === "Relawan") {
      if (pathname === "/admin/main/user/add")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/main/caleg/add")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/main/wilayah")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/sainte-lague")
        return NextResponse.redirect(`${origin}/404`);
    }

    // limit untuk user TPS
    if (verifiedToken.role === "Relawan") {
      if (pathname.startsWith("/admin/main"))
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/wilayah")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/user-tps")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/user-tps/add")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/user-tps/generate")
        return NextResponse.redirect(`${origin}/404`);
      if (pathname === "/admin/pungut-hitung/sainte-lague")
        return NextResponse.redirect(`${origin}/404`);
    }
  }

  return NextResponse.next();
}
