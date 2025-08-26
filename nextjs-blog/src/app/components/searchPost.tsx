'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { getPostByElastic } from "../lib/action/post";
import { toast } from "sonner";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const SearchPost = () => {
    const [openSearch, setOpenSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter()
    const {data,isLoading,refetch} = useQuery({
        queryKey:  [`GET_POST_ELASTIC_SEARCH`],
        queryFn: async () => {
            return await getPostByElastic(
                searchValue
            )
        }
    })
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpenSearch(!openSearch)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [openSearch])
    useEffect(()=>{
        setTimeout(()=> {
            refetch()
        },2000)
    },[searchValue,refetch])
    return (
        <>
            <div className="flex items-center w-80 h-9 rounded-md bg-gray-50 px-3 text-sm text-muted-foreground border border-gray-200">
                {/* Icon search */}
                <Search className="w-4 h-4 mr-2 text-gray-500" />

                {/* Input */}
                <input
                    type="text"
                    placeholder="Search documentation..."
                    className="flex-1 bg-transparent outline-none placeholder:text-gray-500"
                    readOnly
                />

                {/* Shortcut keys */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <kbd className="px-1.5 py-0.5 bg-gray-300 rounded border border-gray-300">Ctrl</kbd>
                    <kbd className="px-1.5 py-0.5 bg-gray-300 rounded border border-gray-300">K</kbd>
                </div>
            </div>
            <Dialog open={openSearch} onOpenChange={setOpenSearch}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Search</DialogTitle>
                    </DialogHeader>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full p-2 border rounded-md"
                        autoFocus
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                        }}
                    />
                    <div className="mt-4 max-h-[400px] overflow-y-auto space-y-2">
                        {   !isLoading ?
                            Array.isArray(data?.post) && data.post.length > 0 ? (
                            data.post.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer transition"
                                onClick={() => {
                                    router.push(`/blog/${p.slug}/${p.id}`);
                                }}
                            >
                                <Image
                                src={p.thumbnail ? p.thumbnail : '/no-image.png'}
                                alt={p.title}
                                width={9}
                                height={9}
                                unoptimized
                                className="w-14 h-14 object-cover rounded-md border"
                                />
                                <div className="flex-1">
                                <h5 className="font-medium text-gray-800 line-clamp-1">
                                    {p.title}
                                </h5>
                                <p>{dayjs(p?.createdAt).format("DD/MM/YYYY")}</p>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Không có kết quả</p>
                        
                        ) : 
                        (
                            Array.from({length:12}).map((_,index)=>{
                                return(
                                    <div key={index} 
                                    className="flex items-center gap-3 p-2 
                                    border rounded-lg 
                                    hover:bg-gray-50 cursor-pointer transition">
                                        <Skeleton className="h-12 w-12 rounded-md" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[400px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SearchPost