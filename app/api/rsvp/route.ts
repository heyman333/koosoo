import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { name, attend, side, headcount, meal } = await req.json();

  if (!name?.trim() || !attend) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (attend === "yes" && (!side || !meal)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const payload = {
    name: name.trim(),
    attend: attend === "yes",
    side: attend === "yes" ? side : null,
    headcount: attend === "yes" ? headcount : null,
    meal: attend === "yes" ? meal === "yes" : null,
  };

  const { error } = await supabase.from("rsvp").insert(payload);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
