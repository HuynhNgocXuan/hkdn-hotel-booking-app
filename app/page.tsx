import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";

interface HomeProps {
  searchParams: Promise<{
    title: string;
    country: string;
    state: string;
    city: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams; // unwrap promise
  const hotels = await getHotels(params);
  return (
    <div>
      {hotels.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          Không tìm thấy khách sạn phù hợp. 🤣🤣🤣
        </div>
      ) : (
        <HotelList hotels={hotels} />
      )}
    </div>
  );
}
