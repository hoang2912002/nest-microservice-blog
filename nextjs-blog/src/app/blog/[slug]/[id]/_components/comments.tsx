'use client'

import { PaginationPage } from "@/app/components/pagination";
import { getPostComment } from "@/app/lib/action/comment";
import { SessionUser } from "@/app/lib/session";
import { DEFAULT_PAGESIZE } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { skip } from "node:test";
import { use, useState } from "react";
import CommentCard from "./commentCard";
import CommentCardSkeleton from "./commentCardSkeleton";
import { useSearchParams } from "next/navigation";
import AddComment from "./addComment";

type Props = {
    postId: number,
    user?: SessionUser,
    
};
const Comments = ({postId,user}:Props) => {
    // const [page, setPage] = useState(1)
    const searchParams = useSearchParams()
    const page = Number(searchParams.get('page') || 0)
    const {data, isLoading, refetch} = useQuery({
        queryKey: ['GET_POST_COMMENT',postId,page],
        queryFn: async() => {
            return await getPostComment({
                postId,
                page: Number(page), // đảm bảo là số
                pageSize: DEFAULT_PAGESIZE,
            })
        }
    })
    const totalPage = data?.countAllComment ? Math.ceil(data?.countAllComment / DEFAULT_PAGESIZE) : 1
    return (
        <div className="p-2 rounded-md shadow-md">
            <h6 className="text-lg text-slate-700">Comment</h6>
            {!!user && <AddComment postId={postId} user={user} refetch={refetch} defaultBtn={true}/>}
            <div className="flex flex-col gap-2 pl-4">
                {Array.isArray(data?.comments) && data.comments.map((comment)=> {
                    return (
                        <div key={comment.id}>

                            <CommentCard postId={postId} refetch={refetch} user={user} comment={comment} key={comment.id} parentComment={comment} repComment_FromChild={false} />
                            {Array.isArray(comment?.replies) && comment.replies.length > 0 && (
                                <div className="ml-10 mt-2">
                                    {comment.replies.map((reply)  => (
                                        <CommentCard postId={postId} refetch={refetch} user={user} comment={reply} key={reply.id} replyComment={true} parentComment={comment} repComment_FromChild={true}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }
                )}
            </div>
            {
                isLoading 
                ? Array.from({length:12}).map((_,index)=>(
                    <CommentCardSkeleton key={index}/>
                ))
                : 
                <PaginationPage 
                totalPages={totalPage} 
                currentPage={page}/>
            }
        </div>
    );
}

export default Comments