import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const headers =  {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cookies().get("__session")?.value}`
    };
    const url = process.env.THREAD_WARS_BACKEND_URL

    if (!url) {
      return NextResponse.json(
        { error: "Backend URL is not defined" },
        { status: 500 }
      );
    }

    const response = await fetch(path.join(url, `/threads/${params.threadId}/unlike`), {
      method: "POST",
      headers: headers,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Unable to unlike thread" }, { status: 500 });
    }

    return NextResponse.json({ message: "Thread unliked successfully" });

  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while unliking the thread" },
      { status: 500 }
    );
  }
}
