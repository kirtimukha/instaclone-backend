
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'


const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);
//`${__dirname}/**/*.{queries,mutations}.js` ==> 리팩토링 하면서 쿼리+뮤테이션을 resolvers로 변경함

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);
/* [UPLOAD 이용하기]

import { makeExecutableSchema } from '@graphql-tools/schema'

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;

스키마를 없앤 이유:
apollo server에서 스키마를 생성하지 않고 graphql-tools를 이용해서 스키마를 생성하고 있었음
apollo server를 이용한 upload를 사용하고 싶다면 apollo server가 스키마를 생성하도록 해야 함
schema.js에서 스키마를 실행시키지 않고 server.js typeDefs와 resolvers에서 실행시키도록 변경함
*/

/*[ upload 3단계]
*
1. 유저가 내 서버에 파일을 업로드 하면,
2. 나는 서버에 있는 파일을 aws에 업로드 하고,
3. aws는 나에게 url을 준다.
*/