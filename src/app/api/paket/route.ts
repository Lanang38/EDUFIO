import { NextRequest, NextResponse } from "next/server";
import { paketCollection, toPaket } from "@/lib/db";
import { Paket } from "@/lib/types";

export async function GET() {
  const col = await paketCollection();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(docs.map(toPaket));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Omit<Paket, "id" | "createdAt">;
  const { studentName, program, packageSize, duration, mode } = body;

  if (!studentName?.trim() || !program || !packageSize || !duration || !mode) {
    return NextResponse.json({ error: "Data paket tidak lengkap." }, { status: 400 });
  }

  const col = await paketCollection();
  const doc = {
    studentName: studentName.trim(),
    program,
    packageSize,
    duration,
    mode,
    createdAt: new Date().toISOString(),
  };
  const result = await col.insertOne(doc);
  return NextResponse.json(toPaket({ _id: result.insertedId, ...doc }), { status: 201 });
}
