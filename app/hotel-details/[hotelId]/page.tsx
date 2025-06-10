import { getBookings } from "@/actions/getBookings";
import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";

interface HotelDetailsProps {
  params: {
    hotelId: string;
  };
}

const HotelDetails = async ({ params }: HotelDetailsProps) => {
  const { hotelId } = await params;
  const hotel = await getHotelById(hotelId);

  if (!hotel)
    return <div>Oop! Hotel with the given ID {params.hotelId} not found.</div>;

  const bookings = await getBookings(hotelId);

  return (
    <div>
      <HotelDetailsClient hotel={hotel} bookings={bookings} />
    </div>
  );
};

export default HotelDetails;
