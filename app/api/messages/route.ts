import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = "koosoo:messages";
const PAGE_SIZE = 5;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const [messages, total] = await Promise.all([
    redis.lrange(KEY, offset, offset + PAGE_SIZE - 1),
    redis.llen(KEY),
  ]);
  return NextResponse.json({ messages, total });
}

export async function POST(req: Request) {
  const { name, message } = await req.json();
  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const item = { name: name.trim(), message: message.trim(), at: Date.now() };
  await redis.lpush(KEY, item);
  return NextResponse.json(item);
}
