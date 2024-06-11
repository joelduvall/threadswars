import { IThread } from "@/models/Thread";
import { cookies } from "next/headers";
import path from "path";

export default async function getThreads() : Promise<IThread[]> {
  
  const url = process.env.THREAD_WARS_BACKEND_URL

  if (!url) {
    throw new Error("Backend URL is not defined");
  }

  const headers =  {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${cookies().get("__session")?.value}`
  };
  
  const response = await fetch(path.join(url,"/threads"), {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch threads");
  }

  return response.json();
}

