import client from "../../client";
import bcrypt from "bcrypt";


export default {
    Mutation: {
        createAccount: async (_, {firstName, lastName, username, email, password }) =>
        {
            // [step1] username, email 이 DB에 있는지 체크
            // [step2] hashing password
            // [step3] save and return the user
            //step1
            try{
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [{username:username}, {email:email}]
                    }
                });
                /* console.log( Date.now() + ':###' +  existingUser );
                 if ( !typeof(existingUser) ){
                     console.log("널이면 저장이 되어야 함" + existingUser);
                     return true
                 } else{
                     console.log("널이 아니면 저장이 안되어야 함" + existingUser);
                 }*/
                if(existingUser){
                    throw new Error("This username is already taken.");
                }

                //step 2 hashing password
                const uglyPassword = await bcrypt.hash(password, 10);
                //console.log( uglyPassword );
                /* const user = await....과  같은 내용, await 시키기 위해 변경함*/
                /*return client.user.create({
                     data: {username, email, firstName, lastName, password: uglyPassword },
                 });*/
                const user = await client.user.create({
                    data: {username, email, firstName, lastName, password: uglyPassword },
                });
                return{
                    ok:true
                }

            } catch(e) {
               return{
                    ok: false,
                    error: "Can't create account."
               }
            }
        },
    },
};