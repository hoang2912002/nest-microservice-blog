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