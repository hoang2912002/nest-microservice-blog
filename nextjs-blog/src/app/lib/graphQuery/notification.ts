import gql from "graphql-tag";

export const GET_ALL_NOTIFICATION = gql`
    query getAllNotification($receiverId:String!,$isRead:Boolean!){
        getAllNotification(receiverId:$receiverId,isRead:$isRead){
            id
            receiverId
            content
            post{
                id
                title
                slug
            }
            sender{
                name
                avatar
            }
            comment{
                userName
                id
            }
            commentId
        }
        countAllNotification(receiverId:$receiverId)
    }
`

export const UPDATE_IS_READ_NOTIFICATION = gql`
    mutation update_IsRead_Notification($id: Int!){
        update_IsRead_Notification(id:$id){
            id
            isRead
        }
    }
`