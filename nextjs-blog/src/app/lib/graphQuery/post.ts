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