import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username } = body;

  try {
    axios.post(`${process.env.API_ENDPOINT}/api/signin`, {
      username,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }

  return NextResponse.json({ message: "Signed in" });
}
