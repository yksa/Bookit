import getSingleRoom from "@/app/actions/getSingleRoom";
import BookingForm from "@/components/BookingForm";
import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import { FaChevronCircleLeft } from "react-icons/fa";

type RoomPageProps = {
  params: {
    id: string;
  };
};

const RoomPage = async ({ params }: RoomPageProps) => {
  const { id } = params;
  const room = await getSingleRoom(id);

  if (!room) {
    return <Heading title="Room Not Found" />;
  }

  const bucketId = process.env
    .NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS as string;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;

  const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${room.image}/view?project=${projectId}`;

  const imageSrc = room.image ? imageUrl : "/images/no-image.jpg";

  return (
    <>
      <Heading title={room.name} />
      <div className="bg-white shadow rounded-lg p-6">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FaChevronCircleLeft className="inline mr-1" />
          <span className="ml-2">Back to Rooms</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:space-x-6">
          <Image
            src={imageSrc}
            alt={room.name}
            className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
            width={400}
            height={100}
          />

          <div className="mt-4 sm:mt-0 sm:flex-1">
            <p className="text-gray-600 mb-4">{room.description}</p>

            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-gray-800">Size:</span>{" "}
                {room.sqft}
                sq ft
              </li>
              <li>
                <span className="font-semibold text-gray-800">
                  Availability:
                </span>
                {room.availability}
              </li>
              <li>
                <span className="font-semibold text-gray-800">Price:</span>$
                {room.price_per_hour}/hour
              </li>
              <li>
                <span className="font-semibold text-gray-800">Address:</span>{" "}
                {room.address}
              </li>
            </ul>
          </div>
        </div>

        <BookingForm roomId={room.$id} />
      </div>
    </>
  );
};

export default RoomPage;
