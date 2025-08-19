import gql from "graphql-tag";

export const GET_ALL_COMMENT = gql`
    query getAllComment_ByAdmin($skip: Int!, $take: Int!){
        getAllComment_ByAdmin(skip: $skip, take: $take){
            id
            content
            authorId
            post{
                id
                title
            }
            replies{
                id
                userName
                user{
                    name
                    _id
                }
            }
            parentId
            user{
                _id
                name
            }
            userName
            createdAt
            updatedAt
            postId
        }
        countAllComment
    }
`

export const CREATE_NEW_COMMENT = gql`
    mutation createNewComment($input: CreateCommentDTO!){
        createNewComment(createCommentDTO: $input){
            id
        }
    }
`

export const UPDATE_COMMENT = gql`
    mutation updateCommentFormAdmin($input: UpdateCommentDTO!){
        updateCommentFormAdmin(updateCommentDTO: $input){
            id
        }
    }
`
export const GET_ALL_COMMENT_FOR_SELECT = gql`
    query getAllCommentForSelect($take: Float!){
        getAllCommentForSelect(take: $take){
            id
            content
        }
    }
`