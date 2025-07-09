import { createClient } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { errorResponse } from './helper'
import { HttpStatus } from './error'
import { string } from 'zod'


export const uploadFile = async (file: File) => {
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_KEY!
    const supabaseBucketName = process.env.SUPABASE_BUCKET_NAME!
    const supabase = await createClient(supabaseUrl,supabaseKey)

    const { data, error } = await supabase.storage.from(supabaseBucketName).
        upload(`${file.name}_${dayjs().unix()}`, file)
    if (error) {
        return errorResponse('Lưu ảnh thất bại', HttpStatus.NOT_FOUND)
    } else {
        const  urlData  = await supabase
        .storage
        .from(supabaseBucketName)
        .getPublicUrl(data.path)

        return urlData.data.publicUrl

    }
}