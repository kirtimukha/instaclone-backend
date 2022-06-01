import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) =>
{
    try {
        if (!token) {
            return null; // token이 없으면 user도 없음
        }
        // 1. token을 찾고
        const { id } = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await client.user.findUnique({ where: { id } });
        // 2.해당 아이디가 user에 있는지 찾는다
        if (user) {
            return user; // token 및 그에 해당하는 user가 있으면 user를 보냄
        } else {
            return null;
        }
    } catch {
        return null;
    }
} ;

// protectedResolver가 보호할 ourResolver를 불러야 하기 때문에
// currying을 한다.(= resolver를 wrap한 resolver를 만듦)
// 내가 부르고 싶은 함수(ourResolver)를 함수(protectedResolver)가 실행될 때 보내야 하기 때문에.
export const protectedResolver = (ourResolver) => (
    root,
    args,
    context,
    info
) => {
    if(!context.loggedInUser){
        return {
            ok: false,
            error: "Please log in to perform this action.",
        }
    }
    return ourResolver(root, args, context, info);
}
/*export function protectedResolver(root, args, context, info){
    return function(root, args, context, info){
        if(!context.loggedInUser){
            return {
                ok: false,
                error: "Please log in to perform this action."
            }
        }
        return ourResolver(root, args, context, info);
    }
}*/
/*

 export const protectedResolver = (user) => {
    if (!user) {
        //throw new Error("You need to login.")
        return {
            ok:false,
            error: "You need to login.",
        }
    }
}*/
