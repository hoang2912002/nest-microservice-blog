'use client'
import { getAllPost } from "@/app/lib/action/post";
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllPostColumns } from "./columns";
import TableShadcn from "@/app/components/common/table";
const AllPost = () => {
    const [currentPage,setCurrentPage] = useState(DEFAULT_PAGE)
    const [pageSize,setPageSize] = useState(DEFAULT_PAGESIZE)
    const {data, isLoading, refetch} = useQuery({
        queryKey: ['GET_ALL_POST_BY_ADMIN',currentPage,pageSize],
        queryFn: async () => {
            return await getAllPost({
                page:currentPage,
                pageSize
            })
        }
    })
    return(
        <TableShadcn 
            columns={getAllPostColumns} 
            data={data?.getAllPost_ByAdmin} 
            pageCount={data?.countAllPost}
            handleChangeCurrentPage={setCurrentPage}
            handleChangePageSize={setPageSize}
            refetch={refetch}
            isLoading={isLoading}
            currentPage={currentPage}
            pageSize={pageSize}
        />
    )
}

export default AllPost