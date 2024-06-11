import QuickPost from "@/components/QuickPost";
import Thread from "@/components/Thread";
import getThreads from "./get-threads";
import addThread from "./add-thread";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "@/models/user";

export default async function Home() {
  
  const threads = await getThreads();

  const sessionUser = await currentUser();
  
  
  const user = { _id: sessionUser?.externalId , username: sessionUser?.username, isVerified: false, avatar: sessionUser?.imageUrl, email: sessionUser?.primaryEmailAddress?.emailAddress } as IUser;

  return (
    <main className="flex flex-col" >
      <div className="flex flex-col ml-auto mr-auto  max-w-xl">
        <SignedIn>
          <QuickPost user={user} ></QuickPost>
        </SignedIn>
        {threads?.map((thread) => (
          <Thread key={thread._id} thread={thread} />
        ))}        
      </div > 
    </main>
  );
}
