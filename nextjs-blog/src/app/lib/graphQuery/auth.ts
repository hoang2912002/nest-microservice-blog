import gql from "graphql-tag";

export const SIGNIN = gql`
    mutation signIn($input: SignInDto!){
        signIn(signInDto:input){
            access_token
            user{
                _id
                name
                avatar
            }
        }
    }
`