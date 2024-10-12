"use server";

import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";

type FormState = {
  error?: string;
  success?: boolean;
};

async function createRoom(
  previousState: Record<string, unknown>,
  formData: FormData,
): Promise<FormState> {
  try {
    // Get database instance
    const { databases } = await createAdminClient();

    const { user } = await checkAuth();
    if (!user) {
      return {
        error: "You must be logged in to create a room",
      };
    }

    // Create room
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE as string;
    const collectionId = process.env
      .NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS as string;
    await databases.createDocument(databaseId, collectionId, ID.unique(), {
      user_id: user.id,
      name: formData.get("name"),
      description: formData.get("description"),
      sqft: formData.get("sqft"),
      capacity: formData.get("capacity"),
      location: formData.get("location"),
      address: formData.get("address"),
      availability: formData.get("availability"),
      price_per_hour: formData.get("price_per_hour"),
      amenities: formData.get("amenities"),
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.log(error);
    const errMessage =
      (error as { response?: { message?: string } })?.response?.message ||
      "Could not create room";
    return { error: errMessage };
  }
}

export default createRoom;
