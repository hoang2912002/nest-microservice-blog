import gql from "graphql-tag";

export const GET_ALL_NOTIFICATION_BY_ADMIN = gql`
    query getAllNotification_ByAdmin($skip: Int!, $take: Int!){
        getAllNotification_ByAdmin(skip: $skip, take: $take){
            id
            type
            content
            senderId
            sender{
                _id
                name
            }
            receiverId
            receiver{
                _id
                name
            }
            postId
            post{
                id
                title
            }
            commentId
            comment{
                id
                content
            }
            isRead
            createdAt
            updatedAt
        }
        countAllNotification_ByAdmin
    }
`
export const CREATE_NOTIFICATION_BY_ADMIN = gql`
    mutation createNotification_ByAdmin($input: CreateNotificationDTO!){
        createNotification_ByAdmin(createNotificationDTO: $input){
            id
        }
    }
`