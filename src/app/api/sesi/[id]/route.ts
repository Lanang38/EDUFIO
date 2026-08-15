import { NextRequest, NextResponse } from "next/server";
import { ObjectId, isValidId, sesiCollection, toSesi } from "@/lib/db";
import { Sesi } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json(null, { status: 404 });

  const col = await sesiCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(toSesi(doc));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json(null, { status: 404 });

  const body = (await req.json()) as Omit<Sesi, "id" | "paketId" | "createdAt">;
  const { date, startTime, endTime, location, topic } = body;
  if (!date || !startTime || !endTime || !topic?.trim()) {
    return NextResponse.json({ error: "Data sesi tidak lengkap." }, { status: 400 });
  }

  const col = await sesiCollection();
  await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { date, startTime, endTime, location: location?.trim() ?? "", topic: topic.trim() } }
  );
  const doc = await col.findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(toSesi(doc));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (isValidId(id)) {
    const col = await sesiCollection();
    await col.deleteOne({ _id: new ObjectId(id) });
  }
  return NextResponse.json({ ok: true });
}
