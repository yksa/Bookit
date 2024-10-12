"use server";

import { redirect } from "next/navigation";
import { Models, Query } from "node-appwrite";

import { createSessionClient } from "@/config/appwrite";
import { TRoom } from "@/models/room";
import { cookies } from "next/headers";

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

async function getMyRooms() {
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

    // Get the rooms related to the user
    const { documents } = await databases.listDocuments(
      databaseId,
      roomCollectionId,
      [Query.equal("user_id", user.$id)],
    );

    // Map documents to rooms
    const rooms: TRoom[] = documents.map(mapDocumentToRoom);

    return rooms;
  } catch (error) {
    console.error("Failed to get rooms", error);
    redirect("/error");
  }
}

export default getMyRooms;
