'use client'
import { DEFAULT_PAGE, DEFAULT_PAGESIZE } from "@/constant";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import TableShadcn from "@/app/components/common/table";
import { getAllAuthor } from "@/app/lib/action/user";
import { getAllNotificationColumns } from "./columns";
import { LikeType } from "@/app/lib/type/modelType";
import { getAllLike } from "@/app/lib/action/like";
import { getAllPost_ForComment } from "@/app/lib/action/post";
import { getAllNotification } from "@/app/lib/action/notification";
import NotificationCreate from "./notificationCreate";
import { getAllComment_ForSelect } from "@/app/lib/action/comment";
import NotificationView from "./notificationView";
import NotificationEdit from "./notificationUpdate";
const AllNotification = () => {
    const [currentPage,setCurrentPage] = useState(DEFAULT_PAGE)
    const [pageSize,setPageSize] = useState(DEFAULT_PAGESIZE)
    const takeVal = {
        post: 550,
        sender: 50,
        receiver: 50,
        comment: 50
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
    
    const [notificationQuery, postQuery ,senderQuery, receiverQuery, commentQuery] = useQueries({
        queries: [
            {
                queryKey: ['GET_ALL_NOTIFICATION_BY_ADMIN', currentPage, pageSize],
                queryFn: () => getAllNotification({ page: currentPage, pageSize }),
            },
            {
                queryKey: ['GET_ALL_POST_FROM_LIKE',currentPage, take.post],
                queryFn: () => getAllPost_ForComment(take.post),
            },
            {
                queryKey: ['GET_ALL_SENDER_FROM_NOTIFICATION',currentPage, take.sender],
                queryFn: () => getAllAuthor(),
            },
            {
                queryKey: ['GET_ALL_RECEIVER_FROM_NOTIFICATION',currentPage, take.receiver],
                queryFn: () => getAllAuthor(),
            },
            {
                queryKey: ['GET_ALL_COMMENT_FROM_NOTIFICATION',currentPage, take.comment],
                queryFn: () => getAllComment_ForSelect(take.comment),
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
            notificationQuery.refetch()
        }
    }
    const handleCallRefetch = (
        type: "POST" | "SENDER" | "RECEIVER" | "COMMENT",
        cb?: (newValues: any) => void
    ) => {
        console.log(1)
        setTake((prev) => ({
            ...prev,
            [type.toLowerCase()]: prev[type.toLowerCase() as keyof typeof prev] + 50,
        }));

        const queryMap: Record<typeof type, any> = {
            POST: postQuery,
            SENDER: senderQuery,
            RECEIVER: receiverQuery,
            COMMENT: commentQuery,
        };

        const query = queryMap[type];
        if (!query) return;

        query
            .refetch()
            .then((res: any) => {
                cb?.(res.data);
            })
            .catch((err: any) => {
                console.error(err);
            });
    };
    return(
        <>
            <div className="mb-2">
            <NotificationCreate 
                openDialog={openDialog} 
                handleShowDialog={handleShowDialog} 
                postData={postQuery.data} 
                isLoading={postQuery.isLoading} 
                senderData={senderQuery.data} 
                isLoadingSender={senderQuery.isLoading}
                receiverData={receiverQuery.data} 
                isLoadingReceiver={receiverQuery.isLoading}
                commentData={commentQuery.data}
                isLoadingComment={commentQuery.isLoading}
                handleCallRefetch={handleCallRefetch}
            />
            </div>
            <TableShadcn 
                columns={getAllNotificationColumns} 
                data={notificationQuery?.data?.getAllNotification_ByAdmin} 
                pageCount={notificationQuery?.data?.countAllNotification_ByAdmin}
                handleChangeCurrentPage={setCurrentPage}
                handleChangePageSize={setPageSize}
                refetch={notificationQuery.refetch}
                isLoading={notificationQuery.isLoading}
                currentPage={currentPage}
                pageSize={pageSize}
                handleShowDialog={handleShowDialog}
            />
            {
                !notificationQuery.isLoading && (
                    <div className="">
                        <NotificationView 
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog}
                            postData={postQuery.data} 
                            isLoading={postQuery.isLoading} 
                            senderData={senderQuery.data} 
                            isLoadingSender={senderQuery.isLoading}
                            receiverData={receiverQuery.data} 
                            isLoadingReceiver={receiverQuery.isLoading}
                            commentData={commentQuery.data}
                            isLoadingComment={commentQuery.isLoading}
                        />
                        <NotificationEdit 
                            openDialog={openDialog} 
                            valueResponse={valueResponse} 
                            handleShowDialog={handleShowDialog} 
                            postData={postQuery.data} 
                            isLoading={postQuery.isLoading} 
                            senderData={senderQuery.data} 
                            isLoadingSender={senderQuery.isLoading}
                            receiverData={receiverQuery.data} 
                            isLoadingReceiver={receiverQuery.isLoading}
                            commentData={commentQuery.data}
                            isLoadingComment={commentQuery.isLoading}
                            handleCallRefetch={handleCallRefetch}
                            refetchData={notificationQuery.refetch}
                        />
                    </div>
                )
            }
        </>
    )
}

export default AllNotification