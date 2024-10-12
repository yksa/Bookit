"use server";

import { createSessionClient } from "@/config/appwrite";
import { isDateRangeOverlapping, toUTCDateTime } from "@/utils/general";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
): Promise<{ error?: string; isAvailable: boolean }> {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const bookingCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;
    if (!databaseId || !bookingCollectionId) {
      throw new Error("Missing required environment variables for Appwrite");
    }

    const { account, databases } = await createSessionClient(
      sessionCookie.value,
    );

    // Get the user
    const user = await account.get();

    // Get all bookings for a given room
    const { documents } = await databases.listDocuments(
      databaseId,
      bookingCollectionId,
      [Query.equal("room_id", roomId)],
    );

    const newCheckIn = toUTCDateTime(checkIn);
    const newCheckOut = toUTCDateTime(checkOut);

    // Loop through all bookings and check for overlapping dates
    for (const booking of documents) {
      const bookingCheckIn = toUTCDateTime(booking.check_in);
      const bookingCheckOut = toUTCDateTime(booking.check_out);

      if (
        isDateRangeOverlapping(
          newCheckIn,
          newCheckOut,
          bookingCheckIn,
          bookingCheckOut,
        )
      ) {
        return {
          error: "Room is not available for the selected dates",
          isAvailable: false,
        };
      }
    }

    // Room is available
    return { isAvailable: true };
  } catch (error) {
    console.error("Failed to check availability", error);
    return { error: "Failed to check availability", isAvailable: false };
  }
}

export default checkRoomAvailability;
