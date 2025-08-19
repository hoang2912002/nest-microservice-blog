import gql from "graphql-tag";

export const GET_ALL_LIKE = gql`
    query getAllLike_ByAdmin($skip: Int!,$take: Int!){
        getAllLike_ByAdmin(skip: $skip, take: $take){
            id
            post{
                id
                title
                slug
            }
            user{
                _id
                name
            }
            postId
            userId
            createdAt
            updatedAt
        }
        countAllLike
    }
`

export const UPDATE_LIKE = gql`
    mutation updateLike_ByAdmin($input: UpdateLikeDTO!){
        updateLike_ByAdmin(updateLikeDTO: $input){
            id
        }
    }
`
export const CREATE_LIKE = gql`
    mutation createLike_ByAdmin($input: CreateLikeDTO!){
        createLike_ByAdmin(createLikeDTO: $input){
            id
        }
    }
`