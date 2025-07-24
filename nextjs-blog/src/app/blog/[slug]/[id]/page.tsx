import { getPostById } from "@/app/lib/action/post";
import { getSession } from "@/app/lib/session";
import Image from "next/image";
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import Comments from "./_components/comments";
import Like from "./_components/like";
type Props = {
    params:{
        id:string;
    }
}
const PostPage = async ({params}:Props) => {
    const id =  (await params).id
    const post = await getPostById(+id)
    const session = await getSession()
    console.log(session)
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    return (
        <main className="container mx-auto px-4 py-8 mt-40">
        <h1 className="text-4xl font-bold mb-4 text-slate-700">
           {post.title} 
        </h1>
        <p className="text-slate-500 text-sm mb-4">By {post.user.name} | {new Date(post.createdAt).toLocaleDateString()}</p>
        <div className="relative w-80 h-60">
            <Image className="rounded-md object-cover" src={post.thumbnail ?? '/no-image.png'} alt={post.title} fill/>
        </div>

        <div dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(post.content)}} />
        <Like postId={post.id} user={session}/>
        <Comments postId={post.id} user={session}/> 

    </main>
    )
}
export default PostPage