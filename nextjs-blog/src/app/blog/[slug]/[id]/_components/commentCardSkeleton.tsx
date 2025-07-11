import { Skeleton } from "@/components/ui/skeleton"

const CommentCardSkeleton = () => {
    return (
        <div className="ml-4 mb-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition">
            <div className="flex">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="">
                    <Skeleton className="h-5 w-[250px] mb-2" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
            </div>
        </div>
    )
}

export default CommentCardSkeleton