"use server";

import { createSessionClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function cancelBooking(
  bookingId: string,
): Promise<{ success?: boolean; error?: string }> {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
    const bookingCollectionId = process.env
      .NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS as string;
    if (!databaseId) {
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

    // Get the booking
    const booking = await databases.getDocument(
      databaseId,
      bookingCollectionId,
      bookingId,
    );

    // Delete the booking if it belongs to the user
    if (booking.user_id !== user.$id) {
      return {
        success: false,
        error: "You do not have permission to cancel this booking",
      };
    } else {
      await databases.deleteDocument(
        databaseId,
        bookingCollectionId,
        bookingId,
      );
      // Revalidate my bookings and bookings
      revalidatePath("/bookings/my", "layout");
      revalidatePath("/bookings", "layout");
    }
  } catch (error) {
    return { error: "Failed to cancel booking" };
  }

  return { success: true };
}

export default cancelBooking;
