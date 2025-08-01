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
import { useEffect, useState } from "react";
import { UploadButton } from "../uploadthing";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Eye,
  Loader2,
  Pencil,
  PencilLineIcon,
  Plus,
  Terminal,
  Trash,
  XCircle,
} from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "../room/AddRoomForm";
import Image from "next/image";
import RoomCard from "../room/RoomCard";
import MapboxPicker from "../MapboxPicker";

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
  address: z.string().min(3, {
    message: "Address must be at least 3 characters long",
  }),
  latitude: z.number(),
  longitude: z.number(),
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
  {
    location: [
      {
        name: "country",
        label: "Country",
        description: "Select the country where your hotel is located",
        placeholder: "Select a country",
      },
      {
        name: "state",
        label: "State",
        description: "Select the state where your hotel is located",
        placeholder: "Select a state",
      },
      {
        name: "city",
        label: "City",
        description: "Select the city where your hotel is located",
        placeholder: "Select a city",
      },
      {
        name: "address",
        label: "Address Detail",
        description: "Enter the address detail of your hotel",
        placeholder: "Ví dụ: 138A Nguyễn Đình Chiểu, Q.3, TP.HCM",
      },
      {
        name: "locationDescription",
        label: "Location Description",
        placeholder: "Describe the location of your hotel",
      },
    ],
  },
];

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hotelIsDeleting, setHotelIsDeleting] = useState(false);
  const [Open, setOpen] = useState(false);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel
      ? {
          ...hotel,
          latitude: hotel.latitude ?? 0,
          longitude: hotel.longitude ?? 0,
        }
      : {
          title: "",
          description: "",
          image: "",
          country: "",
          state: "",
          city: "",
          address: "",
          longitude: 0,
          latitude: 0,
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

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [image]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("country"), form.watch("state")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (hotel) {
      axios
        .patch(`/api/hotel/${hotel.id}`, values)
        .then(() => {
          setIsLoading(false);
          toast.success("Hotel updated successfully");
          router.push(`/hotel/${hotel.id}`);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error updating hotel:", error);
          toast.error("Error updating hotel");
        });
    } else {
      axios
        .post("/api/hotel", values)
        .then((res) => {
          setIsLoading(false);
          toast.success("Hotel created successfully");
          router.push(`/hotel/${res.data.id}`);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error creating hotel:", error);
          toast.error("Error creating hotel");
        });
    }
  }

  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast.success("Image deleted successfully");
        }
      })
      .catch(() => {
        toast.error("Error deleting image");
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  const handleHotelDelete = async (hotel: HotelWithRooms) => {
    setHotelIsDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);

    try {
      const imageKey = getImageKey(hotel.image);

      if (!hotel?.id) {
        toast.error("Hotel ID is required for deletion");
        setHotelIsDeleting(false);
        return;
      }

      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/hotel/${hotel.id}`);
      toast.success("Hotel deleted successfully");
      setHotelIsDeleting(false);
      router.push("/hotel/new");
    } catch (error) {
      setHotelIsDeleting(false);
      console.error("Error deleting hotel:", error);
      toast.error("Error deleting hotel");
    }
  };

  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

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
                          <Input
                            placeholder={item.placeholder}
                            {...field}
                            value={
                              typeof field.value === "string" ? field.value : ""
                            }
                          />
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

              <FormField
                control={form.control}
                name="image"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Upload an Image *</FormLabel>
                    <FormDescription>
                      Choose an image for your hotel.
                    </FormDescription>
                    <FormControl>
                      {image ? (
                        <>
                          <div className="relative w-full max-w-[400px] min-w-[200px] aspect-square mt-4 rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={image}
                              alt="Hotel Image"
                              fill
                              className="object-cover transition duration-300 ease-in-out hover:scale-105"
                            />
                            <Button
                              className="absolute right-2 top-2 bg-white/80 hover:bg-white text-red-500"
                              onClick={() => handleImageDelete(image)}
                              size="icon"
                              type="button"
                              variant="ghost"
                            >
                              {imageIsDeleting ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <XCircle />
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col max-w-[400px] p-12 border-2 items-center rounded-lg mt-4 border-dashed border-primary/50">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                setImage(res[0].ufsUrl);
                                toast.success("Upload Completed");
                              }}
                              onUploadError={(error: Error) => {
                                toast.error(`ERROR! ${error.message}`);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-1 flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items[2].location?.map((item) => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{item.label}</FormLabel>
                        <FormDescription>{item.description}</FormDescription>
                        <FormControl>
                          {item.name === "country" ? (
                            <Select
                              disabled={isLoading}
                              onValueChange={field.onChange}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              defaultValue={
                                typeof field.value === "string"
                                  ? field.value
                                  : undefined
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={item.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.isoCode}
                                    value={country.isoCode}
                                  >
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : item.name === "state" ? (
                            <Select
                              disabled={isLoading || states.length < 1}
                              onValueChange={field.onChange}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              defaultValue={
                                typeof field.value === "string"
                                  ? field.value
                                  : undefined
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={item.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map((state) => (
                                  <SelectItem
                                    key={state.isoCode}
                                    value={state.isoCode}
                                  >
                                    {state.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : item.name === "city" ? (
                            <Select
                              disabled={isLoading || cities.length < 1}
                              onValueChange={field.onChange}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                              defaultValue={
                                typeof field.value === "string"
                                  ? field.value
                                  : undefined
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={item.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map((city) => (
                                  <SelectItem key={city.name} value={city.name}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : item.name === "address" ? (
                            <Input
                              placeholder={item.placeholder}
                              {...field}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                            />
                          ) : (
                            <Textarea
                              placeholder={item.placeholder}
                              {...field}
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : ""
                              }
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <MapboxPicker
                address={form.watch("address")}
                onLocationSelect={(lat, lng) => {
                  form.setValue("latitude", lat);
                  form.setValue("longitude", lng);
                }}
              />

              {hotel && !hotel.rooms.length && (
                <Alert className="text-white bg-indigo-400">
                  <Terminal className="h-4 w-4 stroke-white" />
                  <AlertTitle>One last step!</AlertTitle>
                  <AlertDescription className="text-white">
                    Your hotel was created successfully 🔥
                    <div>
                      Please add some rooms to complete your hotel setup!
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between gap-2 flex-wrap">
                {hotel ? (
                  <Button
                    disabled={isLoading}
                    className="max-w-[150px] bg-green-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4" />
                        Updating
                      </>
                    ) : (
                      <>
                        <PencilLineIcon className="h-4 w-4" />
                        Update Hotel
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled={isLoading}
                    className="max-w-[150px] bg-green-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4" />
                        Creating
                      </>
                    ) : (
                      <>
                        <Pencil className="h-4 w-4" />
                        Create Hotel
                      </>
                    )}
                  </Button>
                )}

                {hotel && (
                  <Button
                    onClick={() => router.push(`/hotel-details/${hotel.id}`)}
                    type="button"
                    className="max-w-[150px] bg-blue-400"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                )}

                {hotel && (
                  <Dialog open={Open} onOpenChange={setOpen}>
                    <DialogTrigger>
                      <Button variant={"outline"} type="button">
                        <Plus className="w-4 h-4" />
                        Add Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px] w-[90%]">
                      <DialogHeader>
                        <DialogTitle>Add a room</DialogTitle>
                        <DialogDescription>
                          Add details about the room you want to add to your
                          hotel.
                        </DialogDescription>
                        <AddRoomForm
                          hotel={hotel}
                          handleDialogueOpen={handleDialogueOpen}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}

                {hotel && (
                  <Button
                    className="max-w-[150px]"
                    type="button"
                    variant={"destructive"}
                    disabled={hotelIsDeleting || isLoading}
                    onClick={() => handleHotelDelete(hotel)}
                  >
                    {hotelIsDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4" />
                        Deleting
                      </>
                    ) : (
                      <>
                        <Trash className="h-4 w-4" />
                        Delete Hotel
                      </>
                    )}
                  </Button>
                )}
              </div>

              {hotel && !!hotel.rooms.length && (
                <div>
                  <hr className="border-gray-300" />
                  <h4 className="text-lg font-semibold my-4">Hotel Rooms</h4>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {hotel.rooms.map((room) => {
                      return (
                        <RoomCard
                          key={room.id}
                          hotel={hotel}
                          room={room}
                        ></RoomCard>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
