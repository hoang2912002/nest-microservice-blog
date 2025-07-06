import { DEFAULT_PAGESIZE } from "@/constants";
import Hero from "./components/hero";
import { getAllPost } from "./lib/action/post";
import { Post } from "./lib/type/modelTypes";
import Posts from "./components/Posts";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

type DataTypes = {
  post: Post[],
  countAllPost: number
}

export default async function Home({searchParams}:Props) {
  const {page, pageSize} = await searchParams
  const {post,countAllPost} = await getAllPost<DataTypes>({
    page: page ? +page : undefined,
    pageSize: pageSize ? +pageSize : undefined
  })
  return (
    <>
      <Hero/>
      <Posts
        posts={post}
        currentPage={page ? +page : 1}
        totalPages={Math.ceil(countAllPost / DEFAULT_PAGESIZE)}  
      />
    </>
  );
}
