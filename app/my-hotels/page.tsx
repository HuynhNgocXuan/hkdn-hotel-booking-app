import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";

const MyHotel = async () => {
  const hotels = await getHotelsByUserId();

  if (!hotels) return <div> No hotels found!</div>;

  return (
    <div>
      <h2 className="font-bold text-center text-2xl mt-4 mb-8">
        Here are your properties
      </h2>
      <HotelList hotels={hotels} />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default MyHotel;
