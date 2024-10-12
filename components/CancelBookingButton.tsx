"use client";

import cancelBooking from "@/app/actions/cancelBooking";
import { useState } from "react";
import { toast } from "react-toastify";

const CancelBookingButton = ({ bookingId }: { bookingId: string }) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );
    if (!confirmed) {
      return;
    }

    setLoading(true);

    const { success, error } = await cancelBooking(bookingId);
    setLoading(false);
    if (success) {
      toast.success("Booking cancelled successfully");
    } else {
      toast.error(error);
    }
  };

  return (
    <button
      onClick={handleCancel}
      className={`bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700 ${loading ? "opacity-50" : ""}`}
      disabled={loading}
    >
      Cancel Booking{loading && "..."}
    </button>
  );
};

export default CancelBookingButton;
