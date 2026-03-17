import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("Missing Naver API credentials", { status: 500 });
  }

  const url =
    "https://maps.apigw.ntruss.com/map-static/v2/raster" +
    "?w=600&h=400&center=127.074664,37.538338&level=16" +
    "&markers=type:d|size:mid|pos:127.074664%2037.538338";

  const res = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret,
    },
  });

  if (!res.ok) {
    return new NextResponse("Failed to fetch map", { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
