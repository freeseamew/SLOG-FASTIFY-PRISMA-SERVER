import { createComment, readComment, deleteComment } from '../../services/commentService.js';
import { createCommentSchema, readCommentSchema, deleteCommentSchema } from './schema.js';
import FastifyAuth from '@fastify/auth';

const commentRoute = async (fastify) => {
  fastify.register(FastifyAuth).after(() => privateCommentRoute(fastify))
}

const privateCommentRoute = (fastify) => {

  fastify.route({
    method: 'GET',
    url:'/:articleId',
    schema: readCommentSchema,
    preHandler: fastify.auth([fastify.currentlyAuth]),
    handler: readComment,
  })

  fastify.route({
    method: 'POST',
    url:'/',
    schema: createCommentSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: createComment,
  })

  fastify.route({
    method: 'DELETE',
    url: '/',
    schema: deleteCommentSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: deleteComment,
  })
}

export default commentRoute
