import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new NextResponse(`Failed to fetch model: ${res.statusText}`, { status: res.status });
    }

    const headers = new Headers();
    headers.set("Content-Type", "model/gltf-binary");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Cache-Control", "public, max-age=86400");

    return new NextResponse(res.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Failed to proxy 3D model:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
