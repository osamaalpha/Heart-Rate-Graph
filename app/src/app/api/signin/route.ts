import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: any) {
  const body = await req.json();
  const { username } = body;
  let response;

  try {
    response = await axios.post(`${process.env.API_ENDPOINT}/api/signin`, {
      username,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }

  return NextResponse.json({ message: "Signed in" });
}
