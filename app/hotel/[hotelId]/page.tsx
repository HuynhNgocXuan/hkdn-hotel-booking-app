import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { auth } from "@clerk/nextjs/server";
import type { PageProps } from "next"; // ✅ Thêm dòng này

const Hotel = async ({ params }: PageProps<{ hotelId: string }>) => {
  const { hotelId } = params;

  const hotel = await getHotelById(hotelId);
  const { userId } = await auth();

  if (!userId) return <div>Not Authenticated</div>;
  if (hotel && hotel.userId !== userId) return <div>Access Denied</div>;

  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
