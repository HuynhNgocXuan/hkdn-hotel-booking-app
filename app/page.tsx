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
  const hotels = await getHotels(Promise.resolve(searchParams));

  return (
    <div>
      <HotelList hotels={hotels} />
    </div>
  );
}
