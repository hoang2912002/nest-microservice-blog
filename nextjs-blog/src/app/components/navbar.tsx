'use client'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getSession, SessionUser } from "../lib/session"
import Profile from "./profile"
import SignInPanel from "./signIn_Out"

type Props = {
    session: SessionUser
}
const NavBar = ({session}:Props) => {
    const [scrollPosition,setScrollPosition] = useState(0)
    const pathname = usePathname()
    const handleScroll = () => {
        setScrollPosition(window.scrollY)
    }
    // const {data, isLoading, refetch} = useQuery({
    //     queryKey: ["GET_SESSION"],
    //     queryFn: async () =>
    //         await getSession(),
    // })
    // console.log({data})

    useEffect(()=>{
        window.addEventListener("scroll",handleScroll)
        return () => {
            window.addEventListener("scroll",handleScroll)
        }
    })

    const isScrollDown = scrollPosition > 10
    const isHome = pathname === '/'
    return (
        <div className=
        {cn("flex justify-end bg-gradient-to-r  px-6 py-4 w-full !text-white transition-shadow duration-300"
                    ,{
                        '!text-gray-700': isScrollDown || !isHome
                    }
                )}>
            <div className="flex justify-end items-center gap-6 w-full">
                <h1 className="text-2xl font-bold">My Modern Blog</h1>
                <NavigationMenu viewport={false}>
                    <NavigationMenuList className="flex items-center gap-4">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="font-bold !bg-transparent hover:!bg-transparent  text-lg">
                                <Link href="/">Blog</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="font-bold !bg-transparent hover:!bg-transparent  text-lg">
                                <Link href="/">About</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="font-bold !bg-transparent hover:!bg-transparent  text-lg">
                                <Link href="/">Contact</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                            {!!session ? 
                                <Profile user={session}/>:
                                <SignInPanel/>
                            }
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
        
    )
}
export default NavBar