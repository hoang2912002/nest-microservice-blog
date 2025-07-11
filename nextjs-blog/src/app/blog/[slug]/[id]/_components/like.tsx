'use client'
import { HeartIcon } from "@heroicons/react/24/solid"
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/20/solid";
import { SessionUser } from "@/app/lib/session";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPostLikeData, likePost, unLikePost } from "@/app/lib/action/comment";
import { toast } from "sonner";
type Props = {
    postId: number,
    user?: SessionUser
};
const Like = ({postId,user}:Props) => {
    const {data,isLoading,refetch} = useQuery({
        queryKey: ["GET_POST_LIKE", postId],
        queryFn: async () => {
            return await getPostLikeData({
                postId: postId,
                userId: user?._id as string
            })
        }
    })
    const unLiked_Post = useMutation({
        mutationFn: () => unLikePost({postId,userId:user._id}),
        onSuccess: () => refetch(),
        onError: () => toast.error("Không thể hủy thích bài viết này")
    })
    const liked_Post = useMutation({
        mutationFn: () => likePost({postId,userId:user._id}),
        onSuccess: () => refetch(),
        onError: () => toast.error("Không thể thích bài viết này")
    })

    return (
        <div className="mt-3 flex items-center justify-start gap-2">
        {data?.check_User_LikedPost ? 
        <button>
            <SolidHeartIcon className="w-6 text-rose-600" onClick={()=>unLiked_Post.mutate()}/>
        </button> : 
        <button>
            <HeartIcon className="w-6" onClick={()=>liked_Post.mutate()}/>
        </button>
        }
        <p className="text-slate-600">{data?.getAll_PostLike ?? 0}</p>
        </div>
    )
}
export default Like