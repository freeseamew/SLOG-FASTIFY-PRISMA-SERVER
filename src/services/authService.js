import jwt from 'jsonwebtoken'
import db from '../lib/db.js'
import appMessages from '../lib/appMessages.js'
const SECRET_KEY = 'my-secret-key' // 추후에 .env로 교체 예정
import { generateHash, verifyPassword, generateAccessToken, generateRefreshToken, duplicateVerifyUser, verifyRefreshToken, verifyAccessToken  } from '../lib/authHelper.js';

const loginWithPassword = async (req, rep) => {
  
  console.log(`login start~~~~~~~~~~~`)

  const { email, pwd } = req.body

  if(!email || !pwd) throw appMessages.unauthorized

  try {

    const authenticationUser = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        // name: true,
      }
    })
  
    if(!authenticationUser) throw appMessages.unauthorized
  
    const passwordVerification = await verifyPassword(email, pwd)
    if(!passwordVerification) throw appMessages.unauthorized
  
    const accessToken = await generateAccessToken(authenticationUser)
    const refreshToken = await generateRefreshToken(authenticationUser)
  
    const values ={
      userId: authenticationUser.id,
      refreshToken: refreshToken,
    }
  
    await db.token.create({
      data: values,
    })
  
    rep.setCookie('refresh_token', refreshToken, {
      // 참고로 safari에서는 https가 아닌 환경에서 httpOnly 쿠키 생성 안됨
      domain: 'localhost',
      sameSite:'none',
      secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })  
  
    const result = {
      id: authenticationUser.id,
      email: authenticationUser.email,
      Authorization: accessToken
    }
  
    return result
  }
  catch(error) {
    console.log(`loginError: ${error}`)
  }

}

const logout = async (req, rep) => {

  const refresh_token = req.cookies.refresh_token

  if(!refresh_token) throw appMessages.unauthorized

  try {
    await db.token.deleteMany({
      where: {
        refreshToken: refresh_token,
      }
    })

    rep.clearCookie('refresh_token', { path: '/' })

    return appMessages.logouOk
  }
  catch(err) {
    throw err
  }
}

const register = async (req, rep) => {

  const { email, pwd } = req.body

  try {

    await duplicateVerifyUser(email)

    const hashPwd = await generateHash(pwd)

    const values = {
      email: email,
      password: hashPwd,
    }

    const result = await db.user.create({
      data: values,
    })

    return result
  }
  catch(err) {
    throw err
  }
}

const refresh = async(req, rep) => {
  const refresh_token = req.cookies.refresh_token

  try {

    if(!refresh_token) throw appMessages.unauthorized

    const authenticationUser = await verifyRefreshToken(refresh_token)
    const access_token = await generateAccessToken(authenticationUser)

    req.headers.user = {
      id: authenticationUser.id,
      email: authenticationUser.email
    } 

    console.log(`refresh!!!`)

    return {
      id: authenticationUser.id,
      email: authenticationUser.email,
      Authorization: access_token,
    }
  }
  catch(err) {
    req.headers.user = {
      id: '',
      email: '',
    } 

    throw err
  }
}

const currentlyAuth = async(req, ref, done) => {
  const { authorization } = req.headers

  req.headers.user = {
    id: '',
    email: '',
  }

  if(authorization) {
    try {
      const access_token = authorization
      const decode = await verifyAccessToken(access_token)
  
      req.headers.user = {
        id: decode.id,
        email: decode.email
      }
    }
    catch(err) {
      req.headers.user = {
        id: '',
        email: '',
      }    
    }
  }
}

const verifySignIn = async (req, rep, done) => {

  const  { authorization } = req.headers;  
  const access_token = authorization

  try {
    
    if (!access_token) throw appMessages.unauthorized

    await verifyAccessToken(access_token)
    return true
  }
  catch(err) {
    throw err
  }
}

export {
  loginWithPassword,
  logout,
  register,
  refresh,
  currentlyAuth,
  verifySignIn
}