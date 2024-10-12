import BookedRoomCard from "@/components/BookedRoomCard";
import getMyBookings from "../actions/getMyBookings";

const BookingsPage = async () => {
  const bookings = await getMyBookings();

  if (!Array.isArray(bookings)) {
    console.error("Error fetching bookings:", bookings.error);
    return <div>Error fetching bookings</div>;
  }

  return (
    <>
      {bookings.length > 0 ? (
        bookings.map((booking) => <BookedRoomCard booking={booking} />)
      ) : (
        <p className="text-gray-600 mt-4">You have no bookings</p>
      )}
    </>
  );
};

export default BookingsPage;
