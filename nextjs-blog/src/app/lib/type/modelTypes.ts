export type Like = {
    id: number;
    userId:string;
    postId:number;
    createdAt:Date;
    updatedAt:Date;
}
export type Tag = {
    id: string;
    name: string;
    createdAt:Date;
    updatedAt:Date;
};
export type Post = {
    id: number;
    title: string;
    slug: string;
    user: User;
    content: string;
    thumbnail: string | null;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    likes?: Like[];
    tags?: Tag[];
}

export type User = {
    _id: string;
    name:string;
    gender:boolean;
    email:string;
    password: string | null;
    avatar:string;
    roleId:string
}

export type Comment = {
    id: number;
    content: string;
    postId?: Post;
    user: User;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: number;
    userName: string
}

export type Notification = {
    id:number;
    type:string;
    content:string;
    senderId?:string;
    sender?:User;
    receiverId?:string;
    receiver?: User;
    postId?: number;
    post?: Post;
    commentId?: number
    comment?: Comment
    isRead: boolean

}