import dayjs from "dayjs";
export const getAllLikeColumns = [
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
        accessorKey: "user.name",
        header: "User",
        enableSorting: true,
    },
    {
        accessorKey: "post.title",
        header: "Post",
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