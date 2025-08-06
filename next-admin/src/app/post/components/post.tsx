'use client'
import { getAllPost } from "@/app/lib/action/post";
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllPostColumns } from "./columns";
import TableShadcn from "@/app/components/common/table";
import PostView from "./postView";
import { PostType } from "@/app/lib/type/modelType";
import { getAllAuthor } from "@/app/lib/action/user";
import PostEdit from "./postEdit";
const AllPost = () => {
    const [currentPage,setCurrentPage] = useState(DEFAULT_PAGE)
    const [pageSize,setPageSize] = useState(DEFAULT_PAGESIZE)
    const dialogKey = {
        view: false,
        edit:false,
        delete:false
    }
    const dialogValue = {
        view: {} as PostType,
        edit: {} as PostType,
        delete:{} as PostType
    }
    const [openDialog,setOpenDialog] = useState(dialogKey)
    const [valueResponse,setValueResponse] = useState(dialogValue)
    // const {data, isLoading, refetch} = useQuery({
    //     queryKey: ['GET_ALL_POST_BY_ADMIN',currentPage,pageSize],
    //     queryFn: async () => {
    //         return await getAllPost({
    //             page:currentPage,
    //             pageSize
    //         })
    //     }
    // })
    // const { data, isLoading } = useQuery({
    //         queryKey: ["GET_ALL_AUTHOR"],
    //         queryFn: async () => {
    //             return await getAllAuthor()
    //         }
    //     })
    const [postQuery, authorQuery] = useQueries({
        queries: [
            {
                queryKey: ['GET_ALL_POST_BY_ADMIN', currentPage, pageSize],
                queryFn: () => getAllPost({ page: currentPage, pageSize }),
            },
            {
                queryKey: ['GET_ALL_AUTHOR',currentPage],
                queryFn: () => getAllAuthor(),
            },
        ],
    })
    const handleShowDialog = (name,value,item = {}) => {
        setOpenDialog((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };
            return updated;
        });
        setValueResponse((prev) => {
            const updated = {
                ...prev,
                [name]: item,
            };
            return updated;
        });
    }
    return(
        <>
            <TableShadcn 
                columns={getAllPostColumns} 
                data={postQuery?.data?.getAllPost_ByAdmin} 
                pageCount={postQuery?.data?.countAllPost}
                handleChangeCurrentPage={setCurrentPage}
                handleChangePageSize={setPageSize}
                refetch={postQuery.refetch}
                isLoading={postQuery.isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                handleShowDialog={handleShowDialog}
            />
            {
                !postQuery.isLoading &&
                <PostView openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog}/>
            }
            {
                !postQuery.isLoading &&
                <PostEdit openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog} authorData={authorQuery.data} isLoading={authorQuery.isLoading}/>
            }
            {
                !postQuery.isLoading &&
                <PostView openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog}/>
            }
            
        </>
    )
}

export default AllPost