import { loginWithPassword, logout, register, refresh, verifySignIn  } from '../../services/authService.js'
import { loginSchema, logoutSchema, registerSchema, refreshSchema, isLoginSchema } from './schema.js';

const authRoute = async(fastify) => {

  // fastify.post('/login', async (req, rep) => {
  //   const { email, pwd } = req.body
  //   return loginWithPassword(email, pwd)
  // })
  // fastify.get('/isLogin', {schema: isLoginSchema, handler: verifySignIn})
  
  // 토큰 필요 
  fastify.post('/login', {schema: loginSchema, handler: loginWithPassword})
  
  fastify.post('/register', {schema: registerSchema, handler: register})
  
  // 토큰 필요
  fastify.delete('/logout',{schema: logoutSchema, handler: logout})
  
  // 토큰 필요
  fastify.post('/refresh', {schema: refreshSchema, handler: refresh})
}

export default authRoute





