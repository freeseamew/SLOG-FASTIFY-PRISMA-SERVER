import jwt from 'jsonwebtoken'
import db from './db.js'
import appMessages from './appMessages.js';
import bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY
const round = Number(process.env.HASH_ROUND) 
const accessTokenExpires = process.env.ACCESS_TOKEN_EXPIRES 
const refreshTokenExpires = process.env.REFRESH_TOKEN_EXPIRES

const generateHash = async (pwd='') => {
  const hashPwd = await bcrypt.hashSync(pwd, round)
  return hashPwd
}

const verifyPassword = async (email='', pwd='') => {

  const encryptedPwd = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      password: true
    }    
  })

  const result = bcrypt.compareSync(pwd, encryptedPwd.password)
  return result
}

const generateAccessToken = (user='') => {
  const accessToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: accessTokenExpires})  
  return accessToken
}

const generateRefreshToken = async (user = '') => {

  // const refreshToken = await jwt.sign({}, SECRET_KEY, {
  //   algorithm: 'HS256',
  //   expiresIn: refreshTokenExpires,
  // })
  const refreshToken = jwt.sign({id: user.id, email: user.email}, SECRET_KEY, {expiresIn: refreshTokenExpires})  
  return refreshToken
}

const duplicateVerifyUser = async (email='') => {
  
  try {
  
    const userCount = await db.user.count({
      where: {
        email: email
      }
    })
    if(userCount > 0) throw appMessages.alreadySignup

    return true
  }
  catch(err) {
    throw err
  }
}

const verifyRefreshToken = async (refresh_token = '') => {

  try {
    const decoeded = await jwt.verify(refresh_token, SECRET_KEY)
    const tokenFromServer = await db.token.count({
      where: {
        userId: decoeded.id,
        refreshToken: refresh_token
      },
      select: {
        refreshToken: true,
      }
    })

    if (tokenFromServer.refreshToken > 0) {
      return decoeded
    }
    else {
      return appMessages.unauthorized
    }
  } 
  catch(err) {
    throw err
  } 
}

const verifyAccessToken = async (access_token='') => {
  try {

    const decode = await jwt.verify(access_token, SECRET_KEY)
    return decode
  }
  catch(err) {
    throw appMessages.invalidToken
  }
}

export {
  generateHash,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  duplicateVerifyUser,
  verifyRefreshToken,
  verifyAccessToken,
}