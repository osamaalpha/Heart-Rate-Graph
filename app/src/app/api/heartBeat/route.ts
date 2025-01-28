import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  // Establish a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Fetch and send data periodically
      const fetchExternalAPI = async () => {
        try {
          const response = await axios.get(
            `${process.env.API_ENDPOINT}/api/measurements?username=${username}`
          );
          const data = response.data;

          // Send data as SSE event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch (error) {
          console.log((error as Error).message);
        }
      };

      setInterval(fetchExternalAPI, 1000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
