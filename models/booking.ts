import { TRoom } from "./room";

type TBooking = {
  $id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  room: TRoom;
};

export default TBooking;
