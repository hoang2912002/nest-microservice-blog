'use client'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TableShadcn from "@/app/components/common/table";
import { getAllAuthor } from "@/app/lib/action/user";
import { getAllLikeColumns } from "./columns";
import { LikeType } from "@/app/lib/type/modelType";
import { getAllLike } from "@/app/lib/action/like";
import { getAllPost_ForComment } from "@/app/lib/action/post";
import LikeView from "./likeView";
import LikeEdit from "./likeUpdate";
import LikeCreate from "./likeCreate";
const AllLike = () => {
    const [currentPage,setCurrentPage] = useState(DEFAULT_PAGE)
    const [pageSize,setPageSize] = useState(DEFAULT_PAGESIZE)
    const takeVal = {
        post: 50,
        author: 50
    }
    const [take,setTake] = useState(takeVal)
    const dialogKey = {
        view: false,
        edit:false,
        delete:false,
        create:false
    }
    const dialogValue = {
        view: {} as LikeType,
        edit: {} as LikeType,
        delete:{} as LikeType,
        create: {} as LikeType
    }
    const [openDialog,setOpenDialog] = useState(dialogKey)
    const [valueResponse,setValueResponse] = useState(dialogValue)
    
    const [likeQuery, postQuery ,authorQuery] = useQueries({
        queries: [
            {
                queryKey: ['GET_ALL_LIKE_BY_ADMIN', currentPage, pageSize],
                queryFn: () => getAllLike({ page: currentPage, pageSize }),
            },
            {
                queryKey: ['GET_ALL_POST_FROM_LIKE',currentPage, take.post],
                queryFn: () => getAllPost_ForComment(take.post),
            },
            {
                queryKey: ['GET_ALL_AUTHOR_FROM_LIKE',currentPage],
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
            likeQuery.refetch()
        }
    }
    const handleCallRefetch = (type: "POST" | "AUTHOR", cb?: (newValues: any) => void) => {
        setTake((prev) => ({
            post: type === "POST" ? prev.post + 50 : prev.post,
            author: type === "AUTHOR" ? prev.author + 50 : prev.author,
        }));

        const query = type === "POST" ? postQuery : authorQuery;

        query
            .refetch()
            .then((res) => {
            if (cb) cb(res.data);
            })
            .catch((err) => {
            console.error(err);
            });
    };

    return(
        <>
            <div className="mb-2">
            <LikeCreate
                openDialog={openDialog} 
                handleShowDialog={handleShowDialog} 
                postData={postQuery.data} 
                isLoading={postQuery.isLoading} 
                authorData={authorQuery.data} 
                isLoadingAuthor={authorQuery.isLoading}
                handleCallRefetch={handleCallRefetch}
            />
            </div>
            <TableShadcn 
                columns={getAllLikeColumns} 
                data={likeQuery?.data?.getAllLike_ByAdmin} 
                pageCount={likeQuery?.data?.countAllLike}
                handleChangeCurrentPage={setCurrentPage}
                handleChangePageSize={setPageSize}
                refetch={likeQuery.refetch}
                isLoading={likeQuery.isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                handleShowDialog={handleShowDialog}
            />
            {
                !likeQuery.isLoading && (
                    <div className="">
                        <LikeView 
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog}
                            postData={postQuery.data} 
                            isLoading={postQuery.isLoading} 
                            authorData={authorQuery.data} 
                            isLoadingAuthor={authorQuery.isLoading}
                        />
                        <LikeEdit 
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog} 
                            postData={postQuery.data} 
                            isLoading={postQuery.isLoading} 
                            authorData={authorQuery.data} 
                            isLoadingAuthor={authorQuery.isLoading}
                            handleCallRefetch={handleCallRefetch}
                            refetchData={likeQuery.refetch}
                        />
                        {/* <PostEdit openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog} authorData={authorQuery.data} isLoading={authorQuery.isLoading}/>
                        <PostDelete openDialog={openDialog} valueResponse={valueResponse} handleShowDialog={handleShowDialog}/> */}
                    </div>
                )
            }
        </>
    )
}

export default AllLike