import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
    Mutation: {
        followUser: protectedResolver(
async (_, { username } , { loggedInUser }) => {
                const ok = await client.user.findUnique(
                    {
                        where: { username }
                    }
                );
                if(!ok ){
                    return {
                        ok : false,
                        error : "That user doesn't exist."
                    }
                }
            await client.user.update({
                where: {
                    id: loggedInUser.id,
                },
                data: {
                    following: {
                        connect: { //user를 다른 user와 연결해주는 기능
                            username // prisma가 connect할 user 를 검색할 수 있도록 해 준다
                                     // connect는 unique한 값으로만 연결 할 수 있다
                        }
                    },
                },
            });
            return {
                ok: true,
            };

        })
    }
}