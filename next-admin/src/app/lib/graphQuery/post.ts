import gql from 'graphql-tag';
export const GET_ALL_POST = gql`
    query getAllPost_ByAdmin($skip:Int!,$take:Int!){
        getAllPost_ByAdmin(skip:$skip,take:$take){
            id
            title
            thumbnail
            content
            createdAt
            slug
            user{
                name,
                _id
            }
            published
        }
        countAllPost
    }
`

export const UPLOAD_FILE_CHUNK = gql`
    mutation uploadFileChunkPost($file:String!,$folderName:String!,$fileName:String!){
        uploadFileChunkPost(file:$file,folderName:$folderName,fileName:$fileName)
    }
`


export const MERGE_FILE_CHUNK = gql`
    query getMergeFile($folderName:String!){
        getMergeFile(folderName:$folderName)
    }
`

export const EDIT_POST_BY_ID = gql`
    mutation update($input: UpdatePostDTO!){
        update(updatePostDTO:$input){
            id
            title
            content
            slug
            authorId
            createdAt
            thumbnail
            published
        }
    }
`