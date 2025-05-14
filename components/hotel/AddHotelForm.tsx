"use client";

import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  country: z.string().min(1, {
    message: "Country is required",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z.string().min(10, {
    message: "Location description must be at least 10 characters long",
  }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundry: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNights: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeeShop: z.boolean().optional(),
});

const items = [
  {
    input: [
      { name: "title", label: "Title", placeholder: "Name your hotel" },
      {
        name: "description",
        label: "Description",
        placeholder: "Describe your hotel",
      },
    ],
  },
  {
    checkbox: [
      { name: "gym", label: "Gym" },
      { name: "spa", label: "Spa" },
      { name: "bar", label: "Bar" },
      { name: "laundry", label: "Laundry" },
      { name: "restaurant", label: "Restaurant" },
      { name: "shopping", label: "Shopping" },
      { name: "freeParking", label: "Free Parking" },
      { name: "bikeRental", label: "Bike Rental" },
      { name: "freeWifi", label: "Free Wi-Fi" },
      { name: "movieNights", label: "Movie Nights" },
      { name: "swimmingPool", label: "Swimming Pool" },
      { name: "coffeeShop", label: "Coffee Shop" },
    ],
  },
];

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurant: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeeShop: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-xl text-center font-semibold">
            {hotel ? "Update your hotel" : "Describe Your Hotel"}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-1 flex-col gap-6">
              {items[0].input?.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name as "title" | "description"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        {item.name === "title" ? (
                          <Input placeholder={item.placeholder} {...field} />
                        ) : (
                          <Textarea placeholder={item.placeholder} {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription>
                  Select the amenities you want to include in your hotel.
                </FormDescription>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  {items[1].checkbox?.map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof z.infer<typeof formSchema>}
                      render={({ field }) => (
                        <FormItem className="flex items-center border rounded-md p-4">
                          <FormControl>
                            <Checkbox
                              className="border-2 border-gray-400"
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>{item.label}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-6">part 2</div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
