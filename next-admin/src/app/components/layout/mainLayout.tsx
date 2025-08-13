'use client'
import { cn } from "@/lib/utils"
import { SidebarTriggerWrapper } from "./sideBarTriggerWrapper"
import { useSidebar } from "@/components/ui/sidebar"
import { SessionUser } from "@/app/lib/type/sessionType"

const MainLayout = ({ children,session }: { children: React.ReactNode, session: SessionUser }) => {
    const { open } = useSidebar()
    return (
        <main
            style={{
                width: open ? 'calc(100% - 16rem)' : 'calc(100% - 3rem)',
            }}
            className="transition-all duration-300 px-4"
        >
            <SidebarTriggerWrapper session={session} />
            <div>
                {children}
            </div>
        </main>
    )
}

export default MainLayout