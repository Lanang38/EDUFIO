import { NextRequest, NextResponse } from "next/server";
import { ObjectId, isValidId, paketCollection, sesiCollection, toPaket } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json(null, { status: 404 });

  const col = await paketCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(toPaket(doc));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidId(id)) return NextResponse.json({ ok: true });

  const pCol = await paketCollection();
  const sCol = await sesiCollection();
  // A package's sessions have no meaning without it — clean them up together.
  await Promise.all([
    pCol.deleteOne({ _id: new ObjectId(id) }),
    sCol.deleteMany({ paketId: id }),
  ]);
  return NextResponse.json({ ok: true });
}
