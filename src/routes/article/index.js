import { createArticle, readArticleList, readArticleOne, updateArticle, deleteArticle } from '../../services/articleService.js'
import { createArticleSchema, readArticlesSchema, readArticleSchema, updateArticleSchema, deleteArticleSchema } from './schema.js'
import FastifyAuth from '@fastify/auth'

const articleRoute = async (fastify) => {
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
    url: '/',
    schema: createArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: createArticle,
  })
  
  fastify.route({
    method: 'PUT',
    url: '/',
    schema: updateArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: updateArticle,    
  })

  fastify.route({
    method: 'DELETE',
    url: '/:articleId',
    schema: deleteArticleSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: deleteArticle,  
  })
}

export default articleRoute