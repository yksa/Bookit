"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";

import { createSessionClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";

async function bookRoom(
  previousState: Record<string, unknown>,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
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
      return {
        error: "You must be logged in to book a room",
      };
    }

    // Extract date and time from the formData
    const checkInDate = formData.get("check_in_date");
    const checkInTime = formData.get("check_in_time");
    const checkOutDate = formData.get("check_out_date");
    const checkOutTime = formData.get("check_out_time");
    const roomId = formData.get("room_id") as string;

    // Combine data and time to ISO 8601 format
    const checkIn = new Date(`${checkInDate}T${checkInTime}`).toISOString();
    const checkOut = new Date(`${checkOutDate}T${checkOutTime}`).toISOString();

    // Check if the room is available
    const { error, isAvailable } = await checkRoomAvailability(
      roomId,
      checkIn,
      checkOut,
    );

    if (error || !isAvailable) {
      return { error: error || "Room is not available for the selected dates" };
    }

    const bookingData = {
      user_id: user.$id,
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut,
    };

    // Create booking
    await databases.createDocument(
      databaseId,
      bookingCollectionId,
      ID.unique(),
      bookingData,
    );

    // revalidate cache
    revalidatePath("/bookings", "layout");

    return { success: true };
  } catch (error) {
    const errMessage =
      (error as { response?: { message?: string } })?.response?.message ||
      "Failed to book room";
    return { error: errMessage };
  }
}

export default bookRoom;
