import { headers } from "next/headers"
import TableShadcn from "../components/common/table"
import AllPost from "./components/post"

const AllPostData = () => {
    const columns =  [
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
            accessorKey: "status",
            header: "Status",
            enableSorting: true,
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
        {
            accessorKey: "action",
            header: "Action"
        }
    ]
    const data = [
        {
            id: "728ed52f",
            amount: 100,
            status: "1",
            email: "m@example.com",
        },
        {
            id: "728ed522",
            amount: 100,
            status: "2",
            email: "m@example.com",
        },
        {
            id: "728ed523",
            amount: 100,
            status: "3",
            email: "m@example.com",
        },
        {
            id: "728ed524",
            amount: 100,
            status: "4",
            email: "m@example.com",
        },
        {
            id: "728ed525",
            amount: 100,
            status: "5",
            email: "m@example.com",
        },
        {
            id: "728ed526",
            amount: 100,
            status: "6",
            email: "m@example.com",
        },
        {
            id: "728ed527",
            amount: 100,
            status: "7",
            email: "m@example.com",
        },
        {
            id: "728ed528",
            amount: 100,
            status: "8",
            email: "m@example.com",
        },
        {
            id: "728ed529",
            amount: 100,
            status: "9",
            email: "m@example.com",
        },
        {
            id: "728ed5210",
            amount: 100,
            status: "10",
            email: "m@example.com",
        },
        {
            id: "728ed5211",
            amount: 100,
            status: "11",
            email: "m@example.com",
        },
    ]
    return(
        <>
            <AllPost/>
        </>
    )
}

export default AllPostData