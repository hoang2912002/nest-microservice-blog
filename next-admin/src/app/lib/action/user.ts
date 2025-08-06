import { fetchAuthRestApi } from "../api/fetchRestAPI"

export const getAllAuthor = async () => {
    const data = await fetchAuthRestApi(null,'user/getAllAuthor','GET',"",false)
    return data?.data
}