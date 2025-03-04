import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Home from "./pages/Index";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Player from "./pages/Player";
import NotFound from "./pages/NotFound";
import { SongsProvider } from "./context/songsContext";
import { SearchedSongsProvider } from "./context/searchContext";
import Details from "./pages/Details";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SongsProvider>
          <SearchedSongsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />

              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/player/:songId" element={<Player />} />
                  <Route path="/album/:albumId" element={<Details />} />
                  <Route path="/playlist/:playlistId" element={<Details />} />
                  <Route path="/artist/:artistId" element={<Details />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </TooltipProvider>
          </SearchedSongsProvider>
        </SongsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
