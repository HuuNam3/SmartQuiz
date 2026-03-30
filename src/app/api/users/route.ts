import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const users = await db.collection("users").find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();
    const users = db.collection("users");

    // Check for existing name
    const existingName = await users.findOne({
      name: body.name,
      className: body.className,
    });
    if (existingName) {
      return NextResponse.json(
        { error: "name already exists" },
        { status: 409 },
      );
    }

    // Create new user
    const result = await users.insertOne(body);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("POST user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { classId, score, group, first } = body;

    const db = await getDb();
    const users = db.collection("users");
    let result
    if(group) {
      result = await users.updateOne(
        { classId: classId },
        {
          $set: {
            group,
            updatedAt: new Date(),
          },
        },
      );
    } else if(first) {
      result = await users.updateOne(
        { classId: classId },
        {
          $set: {
            score,
            startTime: Date.now(),
            updatedAt: new Date(),
          },
        },
      );
    } else {
      result = await users.updateOne(
        { classId: classId },
        {
          $set: {
            score,
            endTime: Date.now(),
            updatedAt: new Date(),
          },
        },
      );
    }


    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("PUT user score error:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 },
    );
  }
}