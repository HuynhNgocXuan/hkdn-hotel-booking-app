import { getBookings } from "@/actions/getBookings";
import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";
import type { PageProps } from "next"; // ✅ Thêm type đúng chuẩn

const HotelDetails = async ({ params }: PageProps<{ hotelId: string }>) => {
  const { hotelId } = params;

  const hotel = await getHotelById(hotelId);

  if (!hotel)
    return <div>Oops! Hotel with the given ID {hotelId} not found.</div>;

  const bookings = await getBookings(hotelId);

  return (
    <div>
      <HotelDetailsClient hotel={hotel} bookings={bookings} />
    </div>
  );
};

export default HotelDetails;
