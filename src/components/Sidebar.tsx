import { Tag, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const categories = [
	"All",
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

export function Sidebar({ className, selectedCategory, onCategorySelect }: { className?: string, selectedCategory?: string | null, onCategorySelect?: (cat: string | null) => void }) {
	return (
		<div
			className={cn(
				"w-full md:w-64 bg-white px-4 md:px-6 py-6 flex flex-col gap-8 text-base min-h-[calc(100vh-48px)] border-0 transition-all justify-start items-stretch",
				className
			)}
		>
			<Link
				href="/create-listing"
				className="mb-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-center text-base hover:bg-blue-700 transition-colors shadow-sm"
			>
				+ Create Listing
			</Link>
			<div>
				<div className="font-bold text-zinc-900 mb-2 text-base tracking-tight">
					Categories
				</div>
				<ul className="flex flex-col gap-1">
					{categories.map((cat) => (
						<li
							key={cat}
							className={cn(
								"px-2 py-2 rounded-lg cursor-pointer hover:bg-zinc-100 transition-colors font-medium",
								(selectedCategory === cat || (cat === "All" && !selectedCategory)) && "bg-blue-100 text-blue-700 font-bold"
							)}
							onClick={() => onCategorySelect?.(cat === "All" ? null : cat)}
						>
							{cat}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
