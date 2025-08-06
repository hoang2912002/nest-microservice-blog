'use client'
import { PostType } from "@/app/lib/type/modelType"
import PostEditForm from "./formEdit"

type DialogState = {
    edit: boolean;
    delete: boolean;
    view: boolean;
}
type DialogValue = {
    view: PostType,
    edit: PostType,
    delete: PostType
}
type AuthorType = {
    _id: string,
    name: string
}
type Props = {
    openDialog: DialogState
    valueResponse: DialogValue
    handleShowDialog: (key: keyof DialogState, value: boolean) => void;
    authorData: [AuthorType]
    isLoading: boolean
}
const PostEdit = ({ openDialog, valueResponse, handleShowDialog, authorData, isLoading }: Props) => {
    return (
        <>
            { openDialog.edit && valueResponse.edit && 
                <PostEditForm
                    post={valueResponse.edit}
                    handleShowDialog={handleShowDialog}
                    authorData={authorData}
                    isLoading={isLoading}
                    openDialog={openDialog}
                />
            }
        </>
    );
};

export default PostEdit