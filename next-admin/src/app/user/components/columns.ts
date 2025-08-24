import dayjs from "dayjs";
export const getAllUserColumns = [
    {
        id: "select", 
        enableSelection: true,
    },
    {
        accessorKey: "_id",
        header: "#",
        enableSorting: true,
    },
    {
        accessorKey: "name",
        header: "Full Name",
        enableSorting: true,
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
            return row.original.gender === true ? 'Male' : 'Female';
        },
    },
    {
        accessorKey: "roleInfo.name",
        header: "Role",
    },
    {
        accessorKey: "accountType",
        header: "Account type",
    },
    {
        accessorKey: "isActive",
        header: "Account active",
    },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
        cell: ({ row }) => {
            return dayjs(row.original.createdAt).format("DD-MM-YYYY");
        },
    },
    {
        accessorKey: "updatedAt",
        header: "UpdatedAt",
        cell: ({ row }) => {
            return dayjs(row.original.updatedAt).format("DD-MM-YYYY");
        },
    },
    {
        accessorKey: "action",
        header: "Action"
    }
]