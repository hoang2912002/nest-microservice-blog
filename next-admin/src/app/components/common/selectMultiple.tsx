'use client'

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandGroup } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Check, ChevronsUpDown, Loader2Icon } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface Props {
    values: any,
    handleCallRefetch?: (type:string,cb?: (newValues: any) => void) => void;
    isLoading: boolean,
    handleOnChange_Parent?: (inputField:string | any, value: any) => void,
    typeCallRefetch?:string,
    mongoDB?: boolean,
    keyMap: [string, string],
    initialValue?: any
    disabled?: boolean,
    returnObjectData?:boolean
}

const SelectMultiple = ({ 
    values, 
    handleCallRefetch, 
    isLoading, 
    handleOnChange_Parent, 
    typeCallRefetch, 
    mongoDB, 
    keyMap, 
    initialValue, 
    disabled,
    returnObjectData
}: Props) => {
    const [idKey, labelKey] = keyMap
    const triggerRef = useRef<HTMLButtonElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const [open, setOpen] = useState(false)
    const [data,setData] = useState(values ?? [])
    const [selectedValue, setSelectedValue] = useState("")
    const [isLoadingScroll, setIsLoadingScroll] = useState(false)
    // Gọi API load thêm khi cuộn tới đáy
    const handleScroll = () => {
        const el = contentRef.current
        if (!el || isLoadingScroll) return
        const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5
        if (isBottom) {
            setIsLoadingScroll(true)
        }
    }
    useEffect(() => {
        if (isLoadingScroll) {
            handleCallRefetch(typeCallRefetch,(newValues) => {
                setIsLoadingScroll(false)
                setData(newValues)
            })
            // refetch()
            //     .finally(() => setIsLoadingScroll(false))
        }
    }, [isLoadingScroll])

    useEffect(() => {
        if (!isLoading) {
            setData(values) // update data khi props values thay đổi
        }
    }, [isLoading, values])

    useEffect(() => {
    if (initialValue !== undefined && initialValue !== null) {
        const a = data.find((v) => v[idKey] === initialValue)
        setSelectedValue(initialValue);
    }
  }, [initialValue]);
    const handleOnchange = (inputField:string, val: any) => {
        setSelectedValue(val)
        let dataRes = val
        if(returnObjectData){
            dataRes = data.find((value: any) => value[idKey] === val )
        }
        handleOnChange_Parent(inputField,dataRes)
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    <span className="truncate max-w-[200px]">
                        {selectedValue
                            ? data.find((v) => v[idKey] === selectedValue)?.[labelKey]
                            : "Select value..."}
                    </span>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="p-0 max-h-60"
                style={{ width: triggerRef.current?.offsetWidth }}
            >
                <Command className="w-full">
                    <CommandInput placeholder="Search value..." className="h-9" />
                    <CommandList 
                        onScroll={handleScroll}
                        ref={contentRef}
                        style={{
                            maxHeight: 300,
                            overflowY: "auto"
                        }}
                    >
                        <CommandEmpty>No value found.</CommandEmpty>
                        <CommandGroup>
                            {data?.map((v) => {
                                return (
                                    <CommandItem
                                        key={String(v[idKey])}
                                        value={String(v[labelKey])}
                                        onSelect={(currentValue) => {
                                            const id = v[labelKey] === currentValue ? v[idKey] : ""
                                            handleOnchange(typeCallRefetch, id)
                                            setOpen(false)
                                        }}
                                    >
                                        <div className="flex w-full items-center">
                                            <span>{v[idKey]}</span>
                                            <span
                                                className={cn(
                                                    "ml-auto",
                                                    v[labelKey]?.length > 40 ? "truncate" : "text-right" // 40 ở đây là số ký tự ước lượng
                                                )}
                                                >
                                                {v[labelKey]}
                                            </span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                selectedValue === v[idKey] ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                )
                            }
                            )}
                            {isLoadingScroll && (
                                <div className="flex justify-center text-center py-2 text-sm text-gray-500">
                                    <Loader2Icon className="animate-spin" />
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default SelectMultiple
