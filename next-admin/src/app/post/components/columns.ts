export const getAllPostColumns =  [
    {
        id: "select", // 👈 ID bắt buộc cho checkbox
        enableSelection: true, // 👈 chỉ định đây là cột chọn hàng
    },
    {
        accessorKey: "id", // 👈 ID bắt buộc cho checkbox
        header: "#",
        enableSorting: true,
    },
    {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "thumbnail",
        header: "Thumbnail",
    },
    // {
    //     accessorKey: "content",
    //     header: "Content",
    // },
    {
        accessorKey: "user.name",
        header: "Author",
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
    },
    {
        accessorKey: "action",
        header: "Action"
    }
]