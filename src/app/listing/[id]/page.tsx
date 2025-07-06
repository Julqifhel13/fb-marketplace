"use client";

// Listing detail page for /listing/[id]
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image"; // ✅ Use next/image
import { use, useState, useEffect } from "react";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  seller_email: string;
  location?: string;
  image_url: string;
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    async function fetchListing() {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("id", unwrappedParams.id)
        .single();
      setListing(data);
    }
    fetchListing();
  }, [unwrappedParams.id]);

  if (!listing) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex items-center justify-center py-10 px-2 md:px-0">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl border flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-zinc-100 p-6 md:p-10">
          <div className="w-full max-w-lg aspect-square flex items-center justify-center rounded-xl overflow-hidden border shadow-md relative">
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-6 p-6 md:p-10">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-zinc-900 leading-tight">
              {listing.title}
            </h1>
            <div className="text-2xl font-bold text-blue-700 mb-3">
              ${listing.price}
            </div>
            <div className="text-zinc-500 text-sm mb-2">
              Listed just now in{" "}
              <span className="font-medium text-zinc-700">
                {listing.location || "Palo Alto, CA"}
              </span>
            </div>
            <div className="text-zinc-500 text-sm mb-2">
              Category:{" "}
              <span className="font-medium text-zinc-700">
                {listing.category}
              </span>
            </div>
            <div className="font-semibold text-zinc-800 text-base mb-1 mt-4">
              Description
            </div>
            <div className="text-zinc-700 text-base mb-4 whitespace-pre-line">
              {listing.description}
            </div>
            <div className="font-semibold text-zinc-800 text-base mb-1">
              Seller Information
            </div>
            <div className="text-zinc-700 text-base mb-4">
              {listing.seller_email}
            </div>
            {/* Message Box */}
            <MessageBox
              listingId={listing.id}
              sellerEmail={listing.seller_email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add MessageBox component below
function MessageBox({
  listingId,
  sellerEmail,
}: {
  listingId: string;
  sellerEmail: string;
}) {
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    setSending(true);
    setError("");
    setSent(false);
    // Insert message into Supabase
    const { error: insertError } = await supabase.from("messages").insert([
      {
        listing_id: listingId,
        message: message,
        seller_email: sellerEmail,
        sender_email: senderEmail,
        sent_at: new Date().toISOString(),
      },
    ]);
    // Send email notification to seller
    await fetch("/api/send-message-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: sellerEmail,
        subject: "You have a new message on Marketplace",
        text: `You received a new message about your listing from ${
          senderEmail || "an interested buyer"
        }:\n\n${message}`,
      }),
    });
    setSending(false);
    if (insertError) {
      setError("Failed to send message. Please try again.");
    } else {
      setSent(true);
      setMessage("");
      setSenderEmail("");
    }
  }

  return (
    <div className="mt-6 p-4 bg-zinc-50 rounded-xl border flex flex-col gap-2">
      <label
        htmlFor="senderEmail"
        className="font-semibold text-zinc-800 text-base mb-1"
      >
        Your Email
      </label>
      <input
        id="senderEmail"
        type="email"
        className="w-full border rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        placeholder="your@email.com"
        value={senderEmail}
        onChange={(e) => setSenderEmail(e.target.value)}
        disabled={sending}
        required
      />
      <label
        htmlFor="message"
        className="font-semibold text-zinc-800 text-base mb-1"
      >
        Message Seller
      </label>
      <textarea
        id="message"
        className="w-full border rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
        placeholder="Hi, is this still available?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 mt-2"
        onClick={handleSend}
        disabled={sending || !message.trim() || !senderEmail.trim()}
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
      {sent && <div className="text-green-600 text-sm mt-1">Message sent!</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}
