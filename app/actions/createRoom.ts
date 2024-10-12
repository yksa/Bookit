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
    const { databases, storage } = await createAdminClient();

    const { user } = await checkAuth();
    if (!user) {
      return {
        error: "You must be logged in to create a room",
      };
    }

    // Upload image
    let imageId;
    const bucketId = process.env
      .NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS as string;
    const image = formData.get("image") as File;
    if (image && image.size > 0 && image.name !== "undefined") {
      const response = await storage.createFile(bucketId, ID.unique(), image);
      imageId = response.$id;
    } else {
      console.log("No image file provided or file is invalid");
      return { error: "Please provide a valid image file" };
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
      image: imageId,
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
