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
    const { name, className, score } = body;
    console.log(name);
    console.log(className);
    console.log(score);

    // Validate
    if (!name || !className || score === undefined) {
      return NextResponse.json(
        { error: "name, class and score are required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const result = await users.updateOne(
      {
        name: name,
        className: className,
      },
      {
        $set: {
          score: score,
          startTime: Date.now() - 30 * 60 * 1000,
          updatedAt: new Date(),
        },
      },
    );

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
