"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Models, Query } from "node-appwrite";

import { createSessionClient } from "@/config/appwrite";
import TBooking from "@/models/booking";
import { TRoom } from "@/models/room";

function mapDocumentToRoom(doc: Models.Document): TBooking {
  return {
    $id: doc.$id,
    user_id: doc.user_id,
    room_id: doc.room_id,
    check_in: doc.check_in,
    check_out: doc.check_out,
    room: doc.room_id as TRoom,
  };
}

async function getMyBookings(): Promise<TBooking[] | { error?: string }> {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const roomCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
    const bookingCollectionId = process.env
      .NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS as string;
    if (!databaseId || !roomCollectionId) {
      throw new Error("Missing required environment variables for Appwrite");
    }

    const { account, databases } = await createSessionClient(
      sessionCookie.value,
    );

    // Get the user
    const user = await account.get();

    if (!user) {
      return { error: "You must be logged in to view your bookings" };
    }

    // Get the bookings related to the user
    const { documents: bookingDocuments } = await databases.listDocuments(
      databaseId,
      bookingCollectionId,
      [Query.equal("user_id", user.$id)],
    );

    const bookings: TBooking[] = bookingDocuments.map(mapDocumentToRoom);

    return bookings;
  } catch (error) {
    console.error("Failed to get bookings", error);
    redirect("/error");
  }
}

export default getMyBookings;
