'use client'
import { nameMap } from "@/app/helper/common"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { MessageCircleCode, MessageCircleMore } from "lucide-react"
import { usePathname } from "next/navigation"
import { Fragment, useEffect } from "react"
import { SessionUser } from "@/app/lib/type/sessionType"
import ChatMessage from "../messages/chatMessage"

interface Props {
  session: SessionUser
}
export function SidebarTriggerWrapper({session}: Props) {
  const { open, toggle } = useSidebar()
  const pathName = usePathname()
  const segments = pathName.split('/').filter(Boolean).slice(0, 2)
  useEffect(() => {
    Cookies.set("sidebar_collapsed", String(open))
  }, [open])

  const getBreadcrumbLabel = (segment: string) =>
    nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

  const buildHref = (index: number) =>
    '/' + segments.slice(0, index + 1).join('/')

  const isSingleList = segments.length === 1
  return (
    <>
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map((segment, index) => {
                  const isLast = index === segments.length - 1
                  const label = getBreadcrumbLabel(segment)
                  const href = buildHref(index)
                  if (isSingleList && index === 0) {
                    return (
                      <Fragment key={index}>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>All List</BreadcrumbPage>
                        </BreadcrumbItem>
                      </Fragment>
                    )
                  }
                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem className="hidden md:block">
                        {isLast ? (
                          <BreadcrumbPage>{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="relative mr-5">
            <ChatMessage session={session} />
          </div>
        </header>
        <hr className="mb-3"/>
      </SidebarInset>
    </>
  )
}
