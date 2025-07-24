import { Comment } from "@/app/lib/type/modelTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "@heroicons/react/20/solid";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/20/solid";
import AddComment from "./addComment";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { SessionUser } from "@/app/lib/session";
type Props = {
  comment: Comment
  parentComment: Comment
  replyComment: boolean
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<{
    comments: Comment;
    count: number;
  }, Error>>
  postId?: number | undefined,
  user?: SessionUser | undefined,
  repComment_FromChild: boolean
};
const CommentCard = ({comment,replyComment,parentComment,refetch, postId, user,repComment_FromChild}: Props) => {
  return (
    <>
      <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition">
        <div className="flex items-center gap-3 text-gray-700">
          <Avatar className="border border-gray-300 w-10 h-10">
            <AvatarImage src={comment.user.avatar} />
            <AvatarFallback>
              <UserIcon className="w-5 h-5 text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{comment.user.name}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed">
          {replyComment ? (
            <>
              <a href="#" className="text-blue-500 hover:underline">@{comment.userName}</a>{' '}
              {comment.content}
            </>
          ) : (
            comment.content
          )}
        </p>
      </div>
      <div className="w-full flex justify-between">  
        <div className="w-23 flex justify-between text-sm ml-2.5 text-gray-600">
          <p>Like</p>
          {/* <button onClick={()=>handleOpenComment()}>
            Comment
          </button> */}
          <AddComment postId={postId} user={user} refetch={refetch} defaultBtn={false} comment={comment} parentComment={parentComment} repComment_FromChild={repComment_FromChild}/>
        </div>
        <div className="mr-2.5 w-10 flex text-sm ml-2.5 text-gray-600">
          <span>40
          </span>
          <SolidHeartIcon className="w-6 text-rose-600 text-sm"/>
        </div>
      </div>
    </>
  );
};

export default CommentCard;