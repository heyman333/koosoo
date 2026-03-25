import { NextResponse } from "next/server";

// TODO: Supabase 연결 후 아래 구현 교체
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function GET() {
  // TODO: supabase.from('messages').select('*').order('at', { ascending: false })
  return NextResponse.json({ messages: [], total: 0 });
}

export async function POST(req: Request) {
  const { name, message } = await req.json();
  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // TODO: supabase.from('messages').insert({ name, message, at: Date.now() })
  const item = { name: name.trim(), message: message.trim(), at: Date.now() };
  return NextResponse.json(item);
}
