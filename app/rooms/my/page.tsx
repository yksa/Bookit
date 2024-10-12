import getMyRooms from "@/app/actions/getMyRooms";
import Heading from "@/components/Heading";
import MyRoomCard from "@/components/MyRoomCard";

const MyRoomsPage = async () => {
  const rooms = await getMyRooms();

  console.log({ rooms });

  return (
    <>
      <Heading title="My Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <MyRoomCard key={room.$id} room={room} />)
      ) : (
        <p>You have no rooms</p>
      )}
    </>
  );
};

export default MyRoomsPage;
