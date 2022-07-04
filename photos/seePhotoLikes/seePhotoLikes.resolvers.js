import client from "../../client";

export default {
    Query: {
        seePhotoLikes: async (_, { id }) => {
            const likes = await client.like.findMany({
                where: { photoId: id },
                /* select: {
                    user: {
                        select: {
                            username: true
                        },
                    },
                }, */
                select: {
                    user: true
                },
            });
            console.log(likes + ':: 라이크 수');
        },
    },
}