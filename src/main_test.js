// import Fastify from 'fastify'
// import db from './lib/db.js';

// const createArticle = async (title="", content="") => {
//   const values = {
//     title: title,
//     content: content,
//     userId: 1,
//   }

//   try {
//     const result = await db.article.create({
//       data: values,
//     })
  
//     return result
//   }
//   catch(err) {
//     throw err
//   }
// }

// const articleType = {
//   id: {type: 'number'},
//   title: {type: 'string'},
//   content: {type: 'string'},
//   userId: {type: 'number'},
//   likeCount: {type: 'number'},
//   commentCount: {type: 'number'},
//   createdAt: {type: 'string'},
// }

// const createArticleSchema = {
//   body: {
//     type: 'object',
//     required: ['title', 'content'],
//     properties: {
//       title: {type: 'string'},
//       content: {type: 'string'},
//     }
//   },
//   response: {
//     200: {
//       type: 'object',
//       properties: articleType,
//     }
//   }
// }

// const fastify = Fastify({
//   logger: true
// })

// fastify.post('/article', {schema: createArticleSchema}, async (req, res) => {
//   const { title, content } = req.body

//   return createArticle(title, content)
// })

// // fastify.register(routes)

// const start = async () => {
//   try {
//     await fastify.listen({ port: 3000 })
//   } catch (err) {
//     fastify.log.error(err)
//     process.exit(1)
//   }
// }

// start()
