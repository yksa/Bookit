"use server";

import { redirect } from "next/navigation";

import { createSessionClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function deleteRoom(
  roomId: string,
): Promise<{ success?: boolean; error?: string }> {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const roomCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
    if (!databaseId || !roomCollectionId) {
      throw new Error("Missing required environment variables for Appwrite");
    }

    const { account, databases } = await createSessionClient(
      sessionCookie.value,
    );

    // Get the user
    const user = await account.get();

    // Get the room
    const room = await databases.getDocument(
      databaseId,
      roomCollectionId,
      roomId,
    );

    // Delete the room if it belongs to the user
    if (room.user_id !== user.$id) {
      {
        return {
          success: false,
          error: "You do not have permission to delete this room",
        };
      }
    } else {
      await databases.deleteDocument(databaseId, roomCollectionId, roomId);

      // Revalidate my rooms and rooms
      revalidatePath("/rooms/my", "layout");
      revalidatePath("/", "layout");

      return { success: true };
    }
  } catch (error) {
    console.error("Failed to delete rooms", error);
    return { error: "Failed to delete room" };
  }
}

export default deleteRoom;
