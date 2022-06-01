require('dotenv').config();
import express from "express";
import logger from "morgan";
import { ApolloServer} from "apollo-server-express";
import {typeDefs, resolvers} from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT
const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    //context는 object 또는  function도 될 수 있음
    context: async ({ req }) => {
        //console.log(req.headers.token);
        return {
            loggedInUser: await getUser(req.headers.token),
            // 1. 토큰을 수동으로 가져오지 않고(token: req.headers.token,)
            // ( token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUzNjAwNjQ0fQ.7QlrNaCQ4DYHbwNXroIwN3tJrUIz2HYsZJg9rf68Piw" )
            // 2. context를 통해서 헤더 리퀘스트에 있는 토큰 정보를 자동으로 가져옴
            // 3. token이 있다면 user로 보냄 => users.utils.js 생성

           /*protectedResolver,*/
            // 보호할 모든 리솔버에 protectedResolver를 넣는 것은 불편하기 때문에
            // 서버에 해당 프로텍트리솔버를 넣어서 사용한다.

        };
    },
});

const app = express();
app.use(logger("tiny"))
app.use("/static", express.static("uploads"))
apollo.applyMiddleware({ app });
app.listen({port:PORT}, () => {
     console.log(`Server in running on http://localhost:${PORT}/graphql`)
    });

