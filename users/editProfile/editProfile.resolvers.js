import {createWriteStream} from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import {protectedResolver} from "../users.utils";

const resolverFn = async (
        _,
        { firstName, lastName, username, email, password: newPassword, bio, avatar },
        { loggedInUser, protectedResolver }// 서버.js 컨텍스트에 있는 것을 가져온다.
        //resolver 는 4개의 args를 가짐 ( root, 내가 쓰는 args, context, info)
        // context에 넣는 것은 모든 resolver에서 접근할 수 있음 context === { token }
    ) => {
let avatarUrl = null;
    if(avatar) {
        const {filename, createReadStream } = await avatar;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
        ); // process.cwd();//current working directory

        //const writeStream = fs.createWriteStream(); import fs from "fs";
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4000/static/${newFilename}`
    }

        // [protectedResolver 1] protectedResolver(loggedInUser);
        // [protectedResolver 1]보호할 모든 리솔버에 protectedResolver를 넣는 것은 불편하기 때문에
        // [protectedResolver 1] 서버에 해당 프로텍트리솔버를 넣어서 사용한다.

        //1~6을 매번 할 수 없으니 이 내용을 아폴로서버 context 에
        //logg{loggedInUser: getUser에 넣고 사용함 === 리졸버 컨텍스트 자리에 {loggedInUser }를 넣어 대체
        //1  [[ const { id } = await jwt.verify(token, process.env.SECRET_KEY);]] 2~6을 1로 대체
        //2 const verifiedToken = await jwt.verify(token, process.env.SECRET_KEY);
        //3 console.log(verifiedToken);
        //4 await jwt.verify(token, process.env.SECRET_KEY)의 결과값 형태
        //5 => { id: 1, iat: 1653600644 }
        //6 const { id } 는  verifiedToken 결과값 오브젝트를 열어서 그 안의 id를 꺼내 쓴다는 뜻임

        let uglyPassword = null;
        if (newPassword) {
            uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
            where: {
                id: loggedInUser.id
            }, // id가 로그인 한 유저의 id를 찾음
            data: {
                firstName,
                lastName,
                username,
                email,
                bio,
                avatar,
                ...(uglyPassword && { password: uglyPassword }),
                ...(avatarUrl && { avatar: avatarUrl }),
            },

        });
        if (updatedUser.id) {
            return {
                ok: true,
            }
        } else {
            return {
                ok: false,
                error : "Could not update profile.",
            }
        }
    }

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn), // 서버가 resolverFn을 호출함
    },
};