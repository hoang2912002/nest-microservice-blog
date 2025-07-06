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