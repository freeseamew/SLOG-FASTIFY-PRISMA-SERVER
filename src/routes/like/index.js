import { addLike, cancelLike, readLikes } from '../../services/likeService.js';
import { postLikeSchema, readLikeSchema } from '../article/schema.js';
import FastifyAuth from '@fastify/auth';

const likeRoute = async (fastify) => {
  fastify.register(FastifyAuth).after(() => privateLike(fastify))
}

const privateLike = (fastify) => {

  fastify.route({
    method:'GET',
    url:'/',
    schema: readLikeSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: readLikes,
  })

  fastify.route({
    method: 'POST',
    url:'/add/:articleId',
    schema: postLikeSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: addLike,
  })

  fastify.route({
    method: 'POST',
    url:'/cancel/:articleId',
    schema: postLikeSchema,
    preHandler: fastify.auth([fastify.currentlyAuth, fastify.verifySignIn]),
    handler: cancelLike,
  })
}

export default likeRoute