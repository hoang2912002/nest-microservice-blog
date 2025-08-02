'use client'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export function SubAppSlideBar({ items }: { items: SidebarItem[] }) {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const { open } = useSidebar() // ⚠️ Make sure your SidebarProvider provides `open`

  return (
    <>
      {items.map((item) => {
        const Icon = item.icon

        // Nếu có submenu
        if (item.children) {
          const isOpen = openItem === item.title

          return (
            <SidebarMenuItem key={item.title}>
              <Collapsible
                open={open && isOpen}
                onOpenChange={() => setOpenItem(isOpen ? null : item.title)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                  >
                    <span className={cn("flex items-center gap-2",
                      open ? "px-1 py-2" : ""
                    )}>
                      <Icon className="w-4 h-4" />
                      {open && <span>{item.title}</span>}
                    </span>
                    {open && (
                      isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {open && (
                  <CollapsibleContent className="overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenuSub>
                      {item.children.map((child) => (
                        <SidebarMenuSubItem key={child.title}>
                          <a
                            href={child.url}
                            className="flex items-center gap-2 px-6 py-1.5 text-sm rounded-md hover:bg-muted transition"
                          >
                            {child.title}
                          </a>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            </SidebarMenuItem>
          )
        }

        // Nếu là menu đơn
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}
