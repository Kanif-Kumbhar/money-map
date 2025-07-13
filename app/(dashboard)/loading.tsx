// app/dashboard/loading.tsx (or wherever your route is)

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="p-6 space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-40" /> {/* Title */}
				<Skeleton className="h-8 w-20" /> {/* Button */}
			</div>

			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				{[...Array(4)].map((_, i) => (
					<Skeleton key={i} className="h-24 w-full rounded-xl" />
				))}
			</div>

			{/* Table/List */}
			<div className="space-y-2">
				{[...Array(5)].map((_, i) => (
					<Skeleton key={i} className="h-10 w-full rounded-md" />
				))}
			</div>
		</div>
	);
}
