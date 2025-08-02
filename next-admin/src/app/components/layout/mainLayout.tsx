'use client'
import { cn } from "@/lib/utils"
import { SidebarTriggerWrapper } from "./sideBarTriggerWrapper"
import { useSidebar } from "@/components/ui/sidebar"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { open } = useSidebar()
    return (
        <main
            style={{
                width: open ? 'calc(100% - 16rem)' : 'calc(100% - 3rem)',
            }}
            className="transition-all duration-300 px-4"
        >
            <SidebarTriggerWrapper />
            <div>
                {children}
            </div>
        </main>
    )
}

export default MainLayout