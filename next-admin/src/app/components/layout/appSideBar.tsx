'use client'
import { BadgeCheck, Bell, Calendar, ChevronDown, ChevronsUpDown, ChevronUp, CreditCard, Home, Inbox, LogOut, Menu, MenuIcon, Search, Settings, Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { PropsWithChildren, useState } from "react"
import { SubAppSlideBar } from "./subAppSideBar"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SessionUser } from "@/app/lib/type/sessionType"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Management User",
    icon: Menu,
    children: [
      { title: "Users", url: "/user" },
      { title: "Roles", url: "/role" },
    ],
  },
  {
    title: "Management Post",
    icon: Menu,
    children: [
      { title: "Posts", url: "/post" },
      { title: "Comments", url: "/comment" },
      { title: "Likes", url: "/like" },
      { title: "Notifications", url: "/notification" },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },

] as SidebarItem[]

type Props = {
  session: SessionUser
}
export function AppSidebar({session}: Props) {
  const { open, isMobile } = useSidebar()
  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Menu content scrollable */}
        <div className="flex-1 overflow-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="flex items-center gap-2">
                <MenuIcon className="w-4 h-4" />
                <h2 className="font-bold">Application</h2>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SubAppSlideBar items={items} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* User info sticky bottom */}
        <div className="px-3 py-4 border-t flex items-center gap-2 overflow-hidden h-15">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="rounded-lg w-6 h-6">
                    <AvatarImage src={session.avatar} alt={session._id} />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "transition-all text-sm h-fit",
                      open ? "ml-2" : "hidden ml-2"
                    )}
                  >
                    <p className="font-medium text-sm">{session.name}</p>
                    <p className="text-xs text-muted-foreground">{session.email}</p>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>

            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={session.avatar} alt={session.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{session.name}</span>
                    <span className="truncate text-xs">{session.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>

    </Sidebar>

  )
}