import dayjs from "dayjs";

export const getAllCommentCols = [
    {
        id: "select",
        enableSelection: true, 
    },
    {
        accessorKey: "id", // 👈 ID bắt buộc cho checkbox
        header: "#",
        enableSorting: true,
    },
    {
        accessorKey: "content",
        header: "Content",
        enableSorting: true,
    },
    {
        accessorKey: "post.title",
        header: "Post",
    },
    {
        accessorKey: "user.name",
        header: "Author",
        enableSorting: true,
        
    },
    {
        accessorKey: "typeComment",
        header: "Type comment",
        cell: ({ row }) => {
            return !!row.original.parentId ? "Reply Comment" : "Comment";
        },
    },
    {
        accessorKey: "userName",
        header: "Repply comment",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return dayjs(row.createdAt).format("DD-MM-YYYY");
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            return dayjs(row.updatedAt).format("DD-MM-YYYY");
        },
    },
    {
        accessorKey: "action",
        header: "Action"
    }
]