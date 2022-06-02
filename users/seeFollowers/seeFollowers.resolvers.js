import client from "../../client";

export default {
    Query:{
        seeFollowers: async (_, {username, page}) => {
            const ok = await client.user.findUnique({
                where: { username },
                select: {id: true},
            })
            if(!ok){
                return{
                    ok:false,
                    error: "User not found.",
                }
            }
            const followers = await client.user
                .findUnique( { where: {username} } )// user를 찾고
                .followers({
                    // [ offset pagination ]
                    take: 5, //페이지 사이즈
                    skip: (page - 1) * 5,
                }); // 그 유저의 follower를 실행하게 해준다. followers 가 함수임

            /*const bFollowers = await client.user.findMany(
                {
                    where: {
                        following: {
                            some: {
                                username,
                            }
                        }
                    }
                }
            );
            console.log(bFollowers[0]);*/

          //[ total 카운트 - 1. 안좋은 방법 ]
          /*  const totalFollowers = await client.user.findMany({
                where: {following: { some: {username} } },
            });
            return{
                ok: true,
                followers,
                totalPages: Math.ceil(totalFollowers.length / 5), //ceil (올림)
            }*/
            //[ total 카운트 - 2. 좋은 방법 " .count " ] // count는 단순히 숫자를 센다 bio, avatar등 불필요한 내용을 불러오지 않는다.
            const totalFollowers = await client.user.count({
                where: {following: { some: {username} } },
            });
            return{
                ok: true,
                followers,
                totalPages: Math.ceil(totalFollowers.length / 5), //ceil (올림)
            }

        },
    },
};