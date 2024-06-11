'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import path from "path";

const schema = z.object({
  content: z.string().min(1, "There must be some content"),
  userId: z.string().optional(),
  parentThreadId: z.string().optional(),
});


export default async function addThread(_prevState: any, params: FormData) {

  const { userId, sessionClaims } = auth();
  //const { user, isSignedIn, isLoaded } = useUser();
  // if (userId) {
  //   const user = await currentUser();
  //   const params = { external_id: ''};
  //   const updatedUser = await clerkClient.users.updateUser(userId, params);
  // }
  
  const validation = schema.safeParse({
    content: params.get("content"),
    parentThreadId: params.get("parentThreadId") === "" ? undefined : params.get("parentThreadId"),
  });

  if (validation.success) {

    const url = process.env.THREAD_WARS_BACKEND_URL

    if (!url) {
      return { error: "Backend URL is not defined" }
    }

    const headers =  {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cookies().get("__session")?.value}`
    };

    const response = await fetch(path.join(url, "/threads"), {
      method: "POST",
      headers: headers,
      body: JSON.stringify(validation.data),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch threads");
    }
    // save the data, send an email, etc.
    //redirect("/");
    revalidatePath("/");
  } else {
    return {
      errors: validation.error.issues,
    };
  }
}