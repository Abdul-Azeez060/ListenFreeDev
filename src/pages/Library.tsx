import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DialogDemo from "@/components/ui/create-playlist-popup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import usePreventPullToRefresh from "@/components/PreventReload";
import { CreatePlaylistDialogue } from "@/components/Library/CreatePlaylistDialogue";
import { useCurrentUserData } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import { useSearchSongs } from "@/context/searchContext";
import LazyImage from "@/components/LazyImage";
import { DeletePlaylistDialogue } from "@/components/Library/DeletePlaylistDialogue";
const Library = () => {
  const { playlists } = useCurrentUserData();
  const { setCategory } = useSearchSongs();
  const navigate = useNavigate();

  async function handlePlaylistClick(playlistId: string) {
    setCategory("userPlaylists");
    navigate(`/playlist/${playlistId}`);
  }
  // const FormSchema = z.object({
  //   spaceId: z.string().min(2, {
  //     message: "spaceId must be at least 2 characters.",
  //   }),
  //   name: z.string().min(2, { message: "name must be at least 2 characters" }),
  // });

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     spaceId: "",
  //     name: "",
  //   },
  // });

  // function onSubmit(data: z.infer<typeof FormSchema>) {}

  usePreventPullToRefresh();

  return (
    // <div className="flex justify-center items-center text-white h-screen w-screen text-2xl px-4 bg-[#12121e]">
    //   Sooooon🤞 Regularly refresh the home page to get the latest updates
    // </div>
    <div className="container px-4 py-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-bold">Your Library</h1>
      </motion.div>

      <div className="space-y-6 ">
        {/* <section className="w-full">
          <h2 className="text-xl text-white font-semibold mb-4">
            Join a Space
          </h2>

          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" className="text-muted" placeholder="Space Id" />
            <Button
              type="submit"
              className="bg-white text-black hover:bg-green-300">
              Join
            </Button>
          </div>
        </section> */}

        <section>
          {/* <h2 className="text-xl font-semibold mb-4 text-white">
            Create a Space
          </h2>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="spaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Space Id</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Space Id"
                          className="text-white"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Name of the Space
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-white"
                          placeholder="Enter name of the space"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div> */}
          <div className="p-4 rounded-lg border flex justify-between border-gray-200 hover:border-accent transition-colors">
            <div className="w-[80%]">
              <h3 className="font-medium text-white">Create New Playlist</h3>
              <p className="text-sm text-gray-500">Add your favorite songs</p>
            </div>
            <CreatePlaylistDialogue />
          </div>
          <div className="grid gap-4 mt-4">
            {playlists?.map((playlist: any) => (
              <motion.div
                key={playlist.$id}
                className="text-black bg-white border-gray-200 border  p-2 rounded-md flex cursor-pointer ">
                <div className="flex justify-between">
                  <div
                    className="flex w-[calc(100vw-8rem)]"
                    onClick={() => handlePlaylistClick(playlist.$id)}>
                    <LazyImage
                      className="w-10 h-10 rounded-md mx-2"
                      src="https://res.cloudinary.com/djanknlys/image/upload/v1742624503/PlaylistLogo.jpg"
                      alt="ListenFreeLogo"
                    />
                    <span className="px-2"> {playlist.name}</span>
                  </div>
                  <DeletePlaylistDialogue playlistId={playlist.$id} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
