import { createArticle, readArticleList, readArticleOne, updateArticle, deleteArticle } from '../../services/articleService.js'
import { createArticleSchema, readArticlesSchema, readArticleSchema, updateArticleSchema, deleteArticleSchema } from './schema.js'
import FastifyAuth from '@fastify/auth'

const articleRoute = async (fastify) => {
  
  // fastify.post('/', {schema: createArticleSchema}, async (req, rep) => {
  //   const { title, content } = req.body
  //   return createArticle(title, content)
  // })

  // fastify.get('/', {schema: readArticlesSchema}, async (req, rep) => {
  //   const { pageNumber, mode } = req.query
    
  //   return readArticleList(pageNumber, mode)
  // })

  // fastify.get('/:articleId', {schema: readArticleSchema}, async (req, rep) => {
  //   const { articleId } = req.params
  //   return readArticleOne(articleId)
  // })

  // fastify.get('/',{schema:readArticlesSchema, handler: readArticleList})
  // fastify.get('/:articleId', {schema: readArticleSchema, handler: readArticleOne})
  
  fastify.register(FastifyAuth).after(() => privateArticleRoute(fastify))
}

const privateArticleRoute = (fastify) => {
  
  fastify.route({
    method: 'GET',
    url: '/',
    schema: readArticlesSchema,
    preHandler: fastify.auth([fastify.currentlyAuth]),
    handler: readArticleList,
  })

  fastify.route({
    method: 'GET',
    url: '/:articleId',
    schema: readArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth]),
    handler: readArticleOne,
  })  

  fastify.route({
    method: 'POST',
    // url: '/add',
    url: '/',
    schema: createArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: createArticle,
  })
  
  fastify.route({
    method: 'PUT',
    // url: '/edit',
    url: '/',
    schema: updateArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: updateArticle,    
  })

  fastify.route({
    method: 'DELETE',
    // url: '/delete/:articleId',
    url: '/:articleId',
    schema: deleteArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: deleteArticle,  
  })
}

export default articleRoute