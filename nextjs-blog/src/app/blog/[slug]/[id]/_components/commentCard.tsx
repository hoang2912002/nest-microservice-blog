import { Comment } from "@/app/lib/type/modelTypes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "@heroicons/react/20/solid";

type Props = {
    comment: Comment
};
const CommentCard = ({comment}: Props) => {
  return (
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
      <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
    </div>
  );
};

export default CommentCard;