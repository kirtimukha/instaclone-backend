import { gql } from "apollo-server"

export default gql`
    type User{
        id        : Int!
        firstName : String!
        lastName  : String
        username  : String!
        email     : String!
        createdAt : String!
        updatedAt : String!
        bio: String
        avatar: String
        photos: [Photo]
        following: [User]
        followers: [User]
        totalFollowing: Int!
        totalFollowers: Int!
        isMe: Boolean!
        isFollowing: Boolean!
    }
`;
//totalFollowing: Int! /* request에 의해서 생성되는 내용. login 여부와 무관함 */
//totalFollowers: Int! /* request에 의해서 생성되는 내용. login 여부와 무관함 */
//isFollowing: Boolean!     /* request에 의해서 생성되는 내용. login 여부에 따라 다르다 */
    //isMe: Boolean!       /* request에 의해서 생성되는 내용. login 여부에 따라 다르다 */