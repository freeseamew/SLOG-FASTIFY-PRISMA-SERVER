import { loginWithPassword, logout, register, refresh, verifySignIn  } from '../../services/authService.js'
import { loginSchema, logoutSchema, registerSchema, refreshSchema, isLoginSchema } from './schema.js';

const authRoute = async(fastify) => {
  fastify.post('/login', {schema: loginSchema, handler: loginWithPassword})
  fastify.post('/register', {schema: registerSchema, handler: register})
  fastify.delete('/logout',{schema: logoutSchema, handler: logout})
  fastify.post('/refresh', {schema: refreshSchema, handler: refresh})
}

export default authRoute





