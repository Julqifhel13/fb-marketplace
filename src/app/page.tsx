"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { SidebarMobileToggle } from "@/components/SidebarMobileToggle";
import { supabase } from "@/lib/supabaseClient";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  seller_email: string;
  image_url: string;
  location?: string;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      let query = supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (search) query = query.ilike("title", `%${search}%`);
      if (selectedCategory) query = query.eq("category", selectedCategory);
      const { data, error } = await query;
      if (!error) setListings(data || []);
      setLoading(false);
    };
    fetchListings();
  }, [search, selectedCategory]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#f6f7f9]">
      <SidebarMobileToggle onClick={() => setSidebarOpen(true)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={
          "md:mt-8 md:ml-0 md:border-0 md:static fixed z-40 top-0 left-0 w-4/5 max-w-xs md:w-72 bg-white md:bg-white/90 md:backdrop-blur-xl md:rounded-3xl p-4 md:p-8 border-b md:border-0 h-full transition-transform duration-300 " +
          (sidebarOpen
            ? "overflow-y-auto overscroll-none touch-pan-y translate-x-0"
            : "-translate-x-full md:translate-x-0 md:overflow-visible")
        }
        style={sidebarOpen ? { WebkitOverflowScrolling: "touch" } : {}}
      >
        <Sidebar
          selectedCategory={selectedCategory ?? undefined}
          onCategorySelect={(cat) => {
            setSelectedCategory(cat === selectedCategory ? null : cat);
            setSidebarOpen(false);
          }}
        />
      </div>
      <main className="flex-1 p-4 md:p-10 mt-[80px] md:mt-0 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 md:mb-8">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none rounded-xl px-6 py-3 flex-1 max-w-md shadow-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg placeholder-zinc-400 transition-all duration-200"
            style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.04)" }}
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight text-zinc-900">
          {selectedCategory ? selectedCategory : "Today's picks"}
        </h2>
        {loading ? (
          <div className="text-center py-10 text-zinc-500">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {listings.map((item) => (
              <Link
                key={item.id}
                href={`/listing/${item.id}`}
                className="group bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="w-full aspect-[4/2.2] flex items-center justify-center bg-zinc-100">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-contain w-full h-full rounded-t-2xl bg-white"
                      style={{ maxHeight: "320px" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-50 flex items-center justify-center text-zinc-400 text-4xl font-bold">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between p-5 gap-2">
                  <div>
                    <div className="font-extrabold text-xl md:text-2xl text-zinc-900 mb-1 leading-tight group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </div>
                    <div className="font-bold text-blue-700 text-lg md:text-xl mb-2">
                      ${Number(item.price).toLocaleString()}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-zinc-500 mb-2">
                      <span>{item.location || "Palo Alto, CA"}</span>
                      <span className="hidden md:inline">·</span>
                      <span>Category: {item.category}</span>
                    </div>
                    <div className="font-semibold text-zinc-800 text-sm mb-1">Description</div>
                    <div className="text-zinc-700 text-base mb-2 line-clamp-2 whitespace-pre-line">
                      {item.description || "Good condition. Pick up on campus!"}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-800 text-xs mb-1">Seller Information</div>
                    <div className="text-zinc-700 text-sm">
                      {item.seller_email || "Your Name"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
