import gql from "graphql-tag";

export const GET_ALL_POST = gql`
    query post($skip:Int!,$take:Int!){
        post(skip:$skip,take:$take){
            id
            title
            thumbnail
            content
            createdAt
            slug
            user{
                name
            }
        }
        countAllPost
    }
`

export const GET_POST_BY_ID = gql`
    query 
        postById($id:Int!) {
            postById(id:$id){
                id
                title
                slug
                content
                thumbnail
                authorId
                createdAt
                tags{
                    id
                    name
                }
                user{
                    name
                    email
                }
            }
        }
    
    
`
export const GET_POST_FOR_ELASTIC = gql`
    query getAllPost_ForElastic($content: String!) {
        getAllPost_ForElastic(content: $content) {
            id
            title
            thumbnail
            createdAt
            slug
        }
    }
`