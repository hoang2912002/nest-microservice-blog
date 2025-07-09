import { deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export async function GET(){
    await deleteSession()
    redirect('/')
}