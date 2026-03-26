import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 5;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const { data, error, count } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .order("at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [], total: count ?? 0 });
}

export async function POST(req: Request) {
  const { name, message } = await req.json();
  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const item = { name: name.trim(), message: message.trim(), at: Date.now() };
  const { data, error } = await supabase.from("messages").insert(item).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
