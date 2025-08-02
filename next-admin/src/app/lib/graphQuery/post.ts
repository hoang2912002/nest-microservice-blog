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
                name
            }
        }
        countAllPost
    }
`