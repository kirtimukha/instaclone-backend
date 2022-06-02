import client from "../../client";

export default {
    Query : {
        seeFollowing: async(_, {username, lastId }) => { //cursor(lastId) 는 내가 DB에 줘야 할 마지막 컨텐츠 정보임
                                                        // 첫 페이지에서는 cursor가 당연히 없다
            const ok = await client.user.findUnique({
                where: { username },
                select: { id: true },
            });
            if (!ok) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }

            const following = await client.user
                .findUnique({ where: { username } })
                .following({
                    take: 5,
                    skip: lastId ? 1 : 0,
                    ...(lastId && { cursor: { id: lastId } }),
                });
            return {
                ok: true,
                following,
            };
        },
    },
};