'use client'
import { getAllPost, getAllPost_ForComment } from "@/app/lib/action/post";
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TableShadcn from "@/app/components/common/table";
import { getAllAuthor } from "@/app/lib/action/user";
import { create } from "domain";
import { getAllComment } from "@/app/lib/action/comment";
import { CommentType } from "@/app/lib/type/modelType";
import { getAllCommentCols } from "./columns";
import CommentCreate from "./commentCreate";
const AllComment = () => {
    const [currentPage,setCurrentPage] = useState(DEFAULT_PAGE)
    const [pageSize,setPageSize] = useState(DEFAULT_PAGESIZE)
    const dialogKey = {
        view: false,
        edit:false,
        delete:false,
        create:false
    }
    const dialogValue = {
        view: {} as CommentType,
        edit: {} as CommentType,
        delete:{} as CommentType,
        create: {} as CommentType
    }
    const [openDialog,setOpenDialog] = useState(dialogKey)
    const [valueResponse,setValueResponse] = useState(dialogValue)
    const [commentQuery, postQuery, authorQuery] = useQueries({
        queries: [
            {
                queryKey: ['GET_ALL_COMMENT_BY_ADMIN', currentPage, pageSize],
                queryFn: () => getAllComment({ page: currentPage, pageSize }),
            },
            {
                queryKey: ['GET_ALL_POST',currentPage],
                queryFn: () => getAllPost_ForComment(),
            },
            {
                queryKey: ['GET_ALL_AUTHOR',currentPage],
                queryFn: () => getAllAuthor(),
            },
        ],
    })
    const handleShowDialog = (name,value,item = {},refetchData=false) => {
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
        if(!!refetchData){
            commentQuery.refetch()
        }
    }
    return(
        <>
            <div className="mb-2">
            <CommentCreate 
                openDialog={openDialog} 
                handleShowDialog={handleShowDialog} 
                postData={postQuery.data} 
                isLoading={postQuery.isLoading} 
                authorData={authorQuery.data} 
                isLoadingAuthor={authorQuery.isLoading}
            />

            </div>
            <TableShadcn 
                columns={getAllCommentCols} 
                data={commentQuery?.data?.getAllComment_ByAdmin} 
                pageCount={commentQuery?.data?.countAllComment}
                handleChangeCurrentPage={setCurrentPage}
                handleChangePageSize={setPageSize}
                refetch={commentQuery.refetch}
                isLoading={commentQuery.isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                handleShowDialog={handleShowDialog}
            />
            {/* {
                !postQuery.isLoading && (
                    <div className="">
                        <PostView openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog}/>
                        <PostEdit openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog} authorData={authorQuery.data} isLoading={authorQuery.isLoading}/>
                        <PostDelete openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog}/>
                    </div>
                )
            } */}
        </>
    )
}

export default AllComment