import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const codes = await db.collection("codes").find({}).toArray();
    return NextResponse.json(codes);
  } catch (error) {
    console.error("GET codes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch codes" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    const db = await getDb();
    const codes = db.collection("codes");
    const result = await codes.updateOne(
      { code: code },
      {
        $set: {
          used: true,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "codes not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT codes score error:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 },
    );
  }
}
