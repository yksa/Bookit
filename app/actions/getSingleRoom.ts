"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import { TRoom } from "@/models/room";

function mapDocumentToRoom(doc: Models.Document): TRoom {
  return {
    $id: doc.$id,
    user_id: doc.user_id,
    name: doc.name,
    description: doc.description,
    sqft: doc.sqft,
    capacity: doc.capacity,
    location: doc.location,
    address: doc.address,
    amenities: doc.amenities,
    availability: doc.availability,
    price_per_hour: doc.price_per_hour,
    image: doc.image,
  };
}

async function getSingleRoom(roomId: string) {
  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const roomCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
    if (!databaseId || !roomCollectionId) {
      throw new Error("Missing required environment variables for Appwrite");
    }

    const { databases } = await createAdminClient();
    const document = await databases.getDocument(
      databaseId,
      roomCollectionId,
      roomId
    );

    // Revalidate the cache for this path
    revalidatePath("/", "layout");
    // Map documents to room
    const room = mapDocumentToRoom(document);

    return room;
  } catch (error) {
    console.error("Failed to get room", error);
    redirect("/error");
  }
}

export default getSingleRoom;
