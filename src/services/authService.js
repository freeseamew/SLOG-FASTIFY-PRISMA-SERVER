import jwt from 'jsonwebtoken'
import db from '../lib/db.js'
import appMessages from '../lib/appMessages.js'
const SECRET_KEY = 'my-secret-key' // 추후에 .env로 교체 예정
import { generateHash, verifyPassword, generateAccessToken, generateRefreshToken, duplicateVerifyUser, verifyRefreshToken, verifyAccessToken  } from '../lib/authHelper.js';

const loginWithPassword = async (req, rep) => {
  const { email, pwd } = req.body

  // 1) 이메일 패스워드 값 유무 확인
  if(!email || !pwd) appMessages.unauthorized

  // 2) 해당 이메일의 가입자 정보 가져오기
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

  // 3) 유저 정보가 없을 경우
  if(!authenticationUser) throw appMessages.unauthorized

  // 4) 패스워드 확인 후 불일치 시 오류 throw
  const passwordVerification = await verifyPassword(email, pwd)
  if(!passwordVerification) throw appMessages.unauthorized

  // 5)  토큰 생성
  const accessToken = await generateAccessToken(authenticationUser)
  const refreshToken = await generateRefreshToken(authenticationUser)

  const values ={
    userId: authenticationUser.id,
    refreshToken: refreshToken,
  }

  // 6) refreshToken 토큰 저장 
  await db.token.create({
    data: values,
  })

  // 8) 토큰 리턴
  // return {
  //   accessToken: accessToken,
  //   refreshToken: refreshToken,
  // }

  // rep.setCookie('access_token', accessToken, {
  //   sameSite:'none',
  //   secure: true,
  //   httpOnly: true,
  //   path: '/',
  //   expires: new Date(Date.now() + 1000 * 60 * 60),
  // })

  rep.setCookie('refresh_token', refreshToken, {
    domain: 'localhost',
    sameSite:'none',
    secure: true, // https가 아닌 경우 쿠키를 전달하지 않는 다는 옵션
    // secure: false, // safari의 경우 https로 해야만 secure: true가 작동됨. 
    httpOnly: true,
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  })  

  const result = {
    id: authenticationUser.id,
    email: authenticationUser.email,
    Authorization: accessToken
  }

  // return appMessages.loginOk
  return result
}

const logout = async (req, rep) => {

  // const { refresh_token } = req.headers
  const refresh_token = req.cookies.refresh_token

  if(!refresh_token) throw appMessages.unauthorized

  try {
    await db.token.deleteMany({
      where: {
        refreshToken: refresh_token,
      }
    })

    // rep.clearCookie('access_token', { domain, path: '/' }) // 도메인이 설정된 경우만 
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

// const accessTokenAsAuth = async (req, rep, done) => {
const verifySignIn = async (req, rep, done) => {

  const  { authorization } = req.headers;  
  const access_token = authorization

  try {
    // 토큰이 없을 경우
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
  // accessTokenAsAuth,
  verifySignIn
}