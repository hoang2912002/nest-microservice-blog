import dayjs from "dayjs";
export const getAllNotificationColumns = [
    {
        id: "select", 
        enableSelection: true,
    },
    {
        accessorKey: "id",
        header: "#",
        enableSorting: true,
    },
    {
        accessorKey: "type",
        header: "Type",
        enableSorting: true,
    },
    {
        accessorKey: "content",
        header: "Content",
    },
    {
        accessorKey: "sender.name",
        header: "Sender",
    },
    {
        accessorKey: "receiver.name",
        header: "Receiver",
    },
    {
        accessorKey: "post.title",
        header: "Post",
    },
    {
        accessorKey: "commentId",
        header: "CommentId",
    },
    {
        accessorKey: "isRead",
        header: "Read",
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
        cell: ({ row }) => {
            return dayjs(row.createdAt).format("DD-MM-YYYY");
        },
    },
    {
        accessorKey: "updatedAt",
        header: "UpdatedAt",
        cell: ({ row }) => {
            return dayjs(row.updatedAt).format("DD-MM-YYYY");
        },
    },
    {
        accessorKey: "action",
        header: "Action"
    }
]