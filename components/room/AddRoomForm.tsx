"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
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
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Pencil, PencilLineIcon, XCircle } from "lucide-react";
import { UploadButton } from "../uploadthing";
import { useRouter } from "next/navigation";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms?: Room[];
  };

  room?: Room;
  handleDialogueOpen: () => void;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  bedCount: z.coerce.number().min(1, "Bed count must be at least 1"),
  guestCount: z.coerce.number().min(1, "Guest count must be at least 1"),
  bathroomCount: z.coerce.number().min(1, "Bathroom count must be at least 1"),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1, "Image is required"),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, "Room price must be at least 1"),

  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

const items = [
  {
    input: [
      { name: "title", label: "Room Title *", placeholder: "Enter room title" },
      {
        name: "description",
        label: "Room Description *",
        placeholder: "Enter room description",
      },
    ],
  },
  {
    checkbox: [
      { name: "roomService", label: "24h Room Services" },
      { name: "TV", label: "TV" },
      { name: "balcony", label: "Balcony" },
      { name: "freeWifi", label: "Free Wifi" },
      { name: "cityView", label: "City View" },
      { name: "oceanView", label: "Ocean View" },
      { name: "forestView", label: "Forest View" },
      { name: "mountainView", label: "Mountain View" },
      { name: "airCondition", label: "Air Condition" },
      { name: "soundProofed", label: "Sound Proofed" },
    ],
  },
  {
    numInput: [
      { name: "roomPrice", label: "Room Price in USD *", min: 0 },
      { name: "bedCount", label: "Number of Beds *", min: 0, max: 8 },
      { name: "guestCount", label: "Max Guests Count *", min: 0, max: 20 },
      { name: "bathroomCount", label: "Number of Bathrooms *", min: 0, max: 8 },
      { name: "kingBed", label: "King Beds", min: 0, max: 20 },
      { name: "queenBed", label: "Queen Beds", min: 0, max: 8 },
      { name: "breakFastPrice", label: "Breakfast Price", min: 0 },
    ],
  },
];

const AddRoomForm = ({ hotel, room, handleDialogueOpen }: AddRoomFormProps) => {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,

      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airCondition: false,
      soundProofed: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (hotel && room) {
      axios
        .patch(`/api/room/${room.id}`, values)
        .then(() => {
          toast.success("🎉 Room updated successfully!");
          setIsLoading(false);
          router.refresh();
          handleDialogueOpen();
        }) 
        .catch((error) => {
          setIsLoading(false);
          console.error("Error updating room:", error);
          toast.error("Error updating room");
        });
    } else {
      if (!hotel) return;
      axios
        .post("/api/room", {...values, hotelId: hotel.id })
        .then(() => {
          setIsLoading(false);
          toast.success("Room created successfully");
          router.refresh();
          handleDialogueOpen();
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error creating room:", error);
          toast.error("Error creating room");
        });
    }
  }

  useEffect(() => {
      if (typeof image === "string") {
        form.setValue("image", image, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    }, [image]);

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

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form  className="space-y-6">
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
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>
              Select the amenities you want to include in your room.
            </FormDescription>

            <div className="grid grid-cols-2 gap-2 mt-4">
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
                      <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                        <Image
                          fill
                          src={image}
                          alt="Hotel Image"
                          className="object-contain"
                        />

                        <Button
                          className="absolute right-[-42px] top-0"
                          onClick={() => handleImageDelete(image)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          {imageIsDeleting ? <Loader2 /> : <XCircle />}
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

          <div className="grid grid-cols-2 gap-4">
            {items[2].numInput?.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name as keyof z.infer<typeof formSchema>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={item.min}
                        max={item.max}
                        {...field}
                        value={
                          typeof field.value === "boolean" ||
                          typeof field.value === "undefined"
                            ? ""
                            : field.value
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div>
            {room ? (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                typeof="button"
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
                    Update Room
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                typeof="button"
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
                    Create Room
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
