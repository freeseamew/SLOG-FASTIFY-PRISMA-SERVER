import { currentlyAuth, verifySignIn  } from '../services/authService.js';
import authRoute from './auth/index.js'
import articleRoute from './article/index.js'
import likeRoute from './like/index.js';
import commentRoute from './comment/index.js'

const routes = async (fastify) => {
  fastify.decorate('currentlyAuth', currentlyAuth)
  fastify.decorate('verifySignIn', verifySignIn)
  fastify.register(authRoute, {prefix: '/auth'})
  fastify.register(articleRoute, {prefix: '/articles'})
  fastify.register(likeRoute ,{prefix: '/likes'})
  fastify.register(commentRoute, {prefix: '/comments'}) 
}

export default routes