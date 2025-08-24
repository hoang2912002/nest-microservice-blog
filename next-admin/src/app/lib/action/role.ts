'use server'

import { fetchAuthRestApi } from "../api/fetchRestAPI"

export const getAllRole_ForSelect = async () => {
    const data = await fetchAuthRestApi(null,'role/getAllRole','GET',"", false)
    return data?.data
}