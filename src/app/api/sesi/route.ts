import { NextRequest, NextResponse } from "next/server";
import { sesiCollection, toSesi } from "@/lib/db";
import { Sesi } from "@/lib/types";

function sortSesi(a: Sesi, b: Sesi) {
  return (a.date + a.startTime).localeCompare(b.date + b.startTime);
}

export async function GET(req: NextRequest) {
  const paketId = req.nextUrl.searchParams.get("paketId");
  const col = await sesiCollection();
  const docs = await col.find(paketId ? { paketId } : {}).toArray();
  return NextResponse.json(docs.map(toSesi).sort(sortSesi));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<Sesi, "id" | "createdAt">;
  const { paketId, date, startTime, endTime, location, topic } = body;

  if (!paketId || !date || !startTime || !endTime || !topic?.trim()) {
    return NextResponse.json({ error: "Data sesi tidak lengkap." }, { status: 400 });
  }

  const col = await sesiCollection();
  const doc = {
    paketId,
    date,
    startTime,
    endTime,
    location: location?.trim() ?? "",
    topic: topic.trim(),
    createdAt: new Date().toISOString(),
  };
  const result = await col.insertOne(doc);
  return NextResponse.json(toSesi({ _id: result.insertedId, ...doc }), { status: 201 });
}
