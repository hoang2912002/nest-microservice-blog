export type LikeType = {
    id:number;
    userId:string;
    user: UserType;
    postId:string;
    post: PostType;
    createdAt:Date;
    updatedAt:Date;
}
export type TagType = {
    id: string;
    name: string;
    createdAt:Date;
    updatedAt:Date;
};
export type PostType = {
    id: number;
    title: string;
    slug: string;
    user: UserType;
    content: string;
    thumbnail: string | null;
    published: boolean;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    likes?: LikeType[];
    tags?: TagType[];
}

export type UserType = {
    _id: string;
    name:string;
    gender:boolean;
    email:string;
    password: string | null;
    avatar:string;
    roleId:string
}

export type CommentType = {
    id: number;
    content: string;
    postId?: PostType;
    user: UserType;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: number;
    userName: string
}

export type NotificationType = {
    id:number;
    type:string;
    content:string;
    senderId?:string;
    sender?:UserType;
    receiverId?:string;
    receiver?: UserType;
    postId?: number;
    post?: PostType;
    commentId?: number
    comment?: Comment
    isRead: boolean

}