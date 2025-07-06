"use client";

import { useState } from "react";
import Image from "next/image"; // ✅ use next/image
import { supabase } from "@/lib/supabaseClient";
import { UploadCloud } from "lucide-react";

const categories = [
  "Vehicles",
  "Property Rentals",
  "Apparel",
  "Classifieds",
  "Electronics",
  "Entertainment",
  "Family",
  "Free Stuff",
  "Garden & Outdoor",
  "Hobbies",
  "Home Goods",
  "Home Improvement",
  "Home Sales",
  "Musical Instruments",
  "Office Supplies",
  "Pet Supplies",
  "Sporting Goods",
  "Toys & Games",
  "Buy and sell groups",
];

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: categories[0],
    seller_email: "",
    image: null as File | null,
    location: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;

    if (name === "image" && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      let imageUrl = "";
      if (form.image) {
        const { data, error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(`public/${Date.now()}-${form.image.name}`, form.image);
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage
          .from("listing-images")
          .getPublicUrl(data.path).data.publicUrl;
      }

      const { error: insertError } = await supabase.from("listings").insert([
        {
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          category: form.category,
          seller_email: form.seller_email,
          image_url: imageUrl,
          location: form.location,
        },
      ]);

      if (insertError) throw insertError;
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        price: "",
        category: categories[0],
        seller_email: "",
        image: null,
        location: "",
      });
      setImagePreview(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create listing";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] py-8 px-2 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left: Form */}
        <form
          className="w-full max-w-md bg-white rounded-xl shadow border p-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block font-semibold mb-2">Photos</label>
            <label className="flex flex-col items-center justify-center border border-zinc-200 rounded-lg h-36 bg-white cursor-pointer transition hover:border-blue-400">
              <input
                type="file"
                name="image"
                accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.svg,.ico,.jfif,.pjpeg,.pjp,.avif,.apng,.heic,.heif"
                onChange={handleChange}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-zinc-400 mb-1" />
              <span className="text-zinc-500 text-base">Add photos</span>
              <span className="text-xs text-zinc-400">
                JPEG, PNG, or WebP (max 5MB)
              </span>
            </label>
          </div>
          <div>
            <label className="block font-semibold mb-1">Title *</label>
            <input
              type="text"
              name="title"
              placeholder="What are you selling?"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-zinc-200 rounded px-3 py-2 bg-zinc-50 focus:bg-white focus:border-blue-500 outline-none text-base"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-zinc-200 rounded px-3 py-2 bg-zinc-50 focus:bg-white focus:border-blue-500 outline-none text-base"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Price *</label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-zinc-200 rounded px-3 py-2 bg-zinc-50 focus:bg-white focus:border-blue-500 outline-none text-base"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Palo Alto, CA"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded px-3 py-2 bg-zinc-50 focus:bg-white focus:border-blue-500 outline-none text-base"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Email *</label>
            <input
              type="email"
              name="seller_email"
              placeholder="your@email.com"
              value={form.seller_email}
              onChange={handleChange}
              required
              className="w-full border border-zinc-200 rounded px-3 py-2 bg-zinc-50 focus:bg-white focus:border-blue-500 outline-none text-base"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Describe your item..."
              value={form.description}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded px-3 py-2 bg-zinc-50 focus:bg-white focus:border-blue-500 outline-none min-h-[60px] text-base"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white text-base font-semibold py-2 rounded mt-2 shadow hover:bg-blue-700 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mt-1">
              Listing created successfully!
            </div>
          )}
        </form>
        {/* Right: Preview */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="font-bold text-lg mb-4 text-center">Preview</div>
            <div className="w-full aspect-[4/2.2] rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="bg-white rounded-lg p-4 border mt-2">
              <div className="font-bold text-xl mb-1 text-zinc-900">
                {form.title || "Title"}
              </div>
              <div className="font-bold text-lg text-blue-700 mb-2">
                {form.price ? `$${form.price}` : "Price"}
              </div>
              <div className="text-zinc-500 mb-1 text-sm">
                Listed just now in {form.location || "Palo Alto, CA"}
              </div>
              <div className="text-zinc-500 mb-1 text-sm">
                Category: {form.category}
              </div>
              <div className="font-semibold text-zinc-800 mt-3 mb-1 text-sm">
                Description
              </div>
              <div className="text-zinc-700 text-base mb-2 whitespace-pre-line">
                {form.description || "Describe your item..."}
              </div>
              <div className="font-semibold text-zinc-800 mb-1 text-sm">
                Seller Information
              </div>
              <div className="text-zinc-700 text-base">
                {form.seller_email || "seller@email.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
