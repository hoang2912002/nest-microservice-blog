'use client'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TableShadcn from "@/app/components/common/table";
import { getAllAuthor, getAllUser } from "@/app/lib/action/user";
import { getAllUserColumns } from "./columns";
import { LikeType, UserType } from "@/app/lib/type/modelType";
import { getAllLike } from "@/app/lib/action/like";
import { getAllPost_ForComment } from "@/app/lib/action/post";
import { getAllNotification } from "@/app/lib/action/notification";
import { getAllComment_ForSelect } from "@/app/lib/action/comment";
import { getAllRole_ForSelect } from "@/app/lib/action/role";
import UserCreate from "./userCreate";
import UserView from "./userView";
import UserEdit from "./userUpdate";
import UserDelete from "./userDelete";
const AllUser = () => {
    const [currentPage,setCurrentPage] = useState(DEFAULT_PAGE)
    const [pageSize,setPageSize] = useState(DEFAULT_PAGESIZE)
    const takeVal = {
        role: 50,
    }
    const [take,setTake] = useState(takeVal)
    const dialogKey = {
        view: false,
        edit:false,
        delete:false,
        create:false
    }
    const dialogValue = {
        view: {} as UserType,
        edit: {} as UserType,
        delete:{} as UserType,
        create: {} as UserType
    }
    const [openDialog,setOpenDialog] = useState(dialogKey)
    const [valueResponse,setValueResponse] = useState(dialogValue)
    const [cursor, setCursor] = useState<{ firstId?: string; lastId?: string, type: number }>({
        firstId:"0",
        lastId:"0",
        type:0
    })
    const [userQuery, roleQuery] = useQueries({
        queries: [
            {
                queryKey: ['GET_ALL_USER_BY_ADMIN', currentPage, pageSize],
                queryFn: () => getAllUser({ page: currentPage, pageSize, cursor }),
            },
            {
                queryKey: ['GET_ALL_ROLE_FROM_USER',currentPage],
                queryFn: () => getAllRole_ForSelect(),
            },
        ],
    })
    useEffect(()=>{
        if(
            userQuery.data && 
            userQuery.data.getAllUserList_ByAdmin &&  
            userQuery.data.getAllUserList_ByAdmin.length > 0 &&
            userQuery.isSuccess
        ){
            setCursor((prev) => ({
                firstId: userQuery.data.getAllUserList_ByAdmin[0]?._id,
                lastId: userQuery.data.getAllUserList_ByAdmin[userQuery.data.getAllUserList_ByAdmin.length - 1]?._id,
                type: prev.type
            }))
        }
    },[userQuery.isSuccess, userQuery.data])
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
            userQuery.refetch()
        }
    }
    const handleChangeGetIdLargeData = (type: number) => {
        setCursor((prev) => ({
            ...prev,
            type
        }))
    }
    return(
        <>
            <div className="mb-2">
            <UserCreate 
                openDialog={openDialog} 
                handleShowDialog={handleShowDialog} 
                userData={userQuery.data} 
                isLoading={userQuery.isLoading} 
                roleData={roleQuery.data}
                isLoadingRole={roleQuery.isLoading}
            />
            </div>
            <TableShadcn 
                columns={getAllUserColumns} 
                data={userQuery?.data?.getAllUserList_ByAdmin} 
                pageCount={userQuery?.data?.countAllUserList_ByAdmin}
                handleChangeCurrentPage={setCurrentPage}
                handleChangePageSize={setPageSize}
                refetch={userQuery.refetch}
                isLoading={userQuery.isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                handleShowDialog={handleShowDialog}
                largeData={true}
                handleChangeGetIdLargeData={handleChangeGetIdLargeData}
            />
            {
                !userQuery.isLoading && (
                    <div className="">
                        <UserView 
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog}
                            userData={userQuery.data} 
                            isLoading={userQuery.isLoading} 
                            roleData={roleQuery.data}
                            isLoadingRole={roleQuery.isLoading}
                        />
                        <UserEdit 
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog} 
                            userData={userQuery.data} 
                            isLoading={userQuery.isLoading} 
                            roleData={roleQuery.data}
                            isLoadingRole={roleQuery.isLoading}
                            // refetchData={userQuery.refetch}
                        />
                        <UserDelete
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog} 
                        />
                    </div>
                )
            }
        </>
    )
}

export default AllUser