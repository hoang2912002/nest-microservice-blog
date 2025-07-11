import gql from "graphql-tag";

export const GET_ALL_POST_COMMENT = gql`
    query getAll_PostComment($postId:Int!,$skip:Int!,$take:Int!){
        getAll_PostComment(postId:$postId,skip:$skip,take:$take){
            id
            content
            authorId
            createdAt

            user{
                name
                avatar
            }
        }
        countAll_PostComment(postId:$postId)    
    }
`

export const GET_ALL_POST_LIKE = gql`
    query getAll_PostLike($postId:Int!,$userId:String!){
        getAll_PostLike(postId:$postId)
        check_User_LikedPost(postId:$postId,userId:$userId)
    }
`

export const UNLIKE_POST = gql`
    mutation unLike_Post($postId:Int!,$userId:String!){
        unLike_Post(postId:$postId,userId:$userId)
    }
`
export const LIKE_POST = gql`
    mutation like_Post($postId:Int!,$userId:String!){
        like_Post(postId:$postId,userId:$userId)
    }
`

export const SAVE_POST_COMMENT = gql`
    mutation save_PostComment($input:CreateCommentInput!){
        save_PostComment(createCommentInput:$input){
            id
        }
    }   
`