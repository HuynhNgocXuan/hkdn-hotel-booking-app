import prismadb from "@/lib/prismadb";

export const getHotelById = async (hotelId: string) => {
    try {
        const hotel = await prismadb.hotel.findUnique({
            where: {
                id: hotelId
            },
            include: {
               rooms: true
            }
        })
        if (!hotel) return null;
        return hotel;
        
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error(String(error));
    }
}