import { NextResponse } from "next/server";

// TODO: Supabase 연결 후 MOCK_MESSAGES 제거 후 아래 구현 교체
// import { createClient } from '@supabase/supabase-js'
// const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

const PAGE_SIZE = 5;

const MOCK_MESSAGES = [
  { name: "뻥부장", message: "님 이쁜 선남선녀 늘 행복하고 꽃길만 걸어 !!", at: Date.now() - 1000 * 60 * 10 },
  { name: "보라", message: "백년해로 하십시오~", at: Date.now() - 1000 * 60 * 20 },
  { name: "회사동료", message: "결혼 너무 축하해~ 예쁜 두사람!", at: Date.now() - 1000 * 60 * 30 },
  { name: "민준", message: "두 분 항상 행복하세요 :)", at: Date.now() - 1000 * 60 * 40 },
  { name: "지은", message: "꽃길만 걷길 바랍니다 💐", at: Date.now() - 1000 * 60 * 50 },
  { name: "현우", message: "결혼 진심으로 축하드려요!", at: Date.now() - 1000 * 60 * 60 },
  { name: "수진", message: "오래오래 행복하게 사세요~", at: Date.now() - 1000 * 60 * 70 },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  // TODO: supabase.from('messages').select('*', { count: 'exact' }).order('at', { ascending: false }).range(offset, offset + PAGE_SIZE - 1)
  const messages = MOCK_MESSAGES.slice(offset, offset + PAGE_SIZE);
  const total = MOCK_MESSAGES.length;

  return NextResponse.json({ messages, total });
}

export async function POST(req: Request) {
  const { name, message } = await req.json();
  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // TODO: supabase.from('messages').insert({ name, message, at: Date.now() })
  const item = { name: name.trim(), message: message.trim(), at: Date.now() };
  MOCK_MESSAGES.unshift(item);
  return NextResponse.json(item);
}
