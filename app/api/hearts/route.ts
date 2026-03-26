import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("hearts")
    .select("count")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ count: data.count });
}

export async function PATCH(req: Request) {
  const { delta } = await req.json();
  if (!delta || typeof delta !== "number" || delta < 1) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("increment_hearts", { delta });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ count: data });
}
