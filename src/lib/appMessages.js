const messages = {
  loginOk: {
    success: true,
    code: 201,
    message: 'Login Ok!'
  },
  logouOk: {
    success: true,
    code: 205,
    message: 'Logout success!'
  },
  refreshToken: {
    success: true,
    code: 201,
    message: 'refresh success'
  },
  accessTokenOk: {
    success: true,
    code: 200,
    message: 'access token ok'
  },
  badRequest: {
    success: false,
    code: 400,
    message: 'Bad Request',
  },
  likeAddError: {
    success: false,
    code: 400,
    message: 'Already Add Like'
  },
  likeCancelError: {
    success: false,
    code: 400,
    message: 'No Like'
  },
  unauthorized: {
    success: false,
    code: 401,
    message: 'Unauthorized',
  },
  invalidToken: {
    success: false,
    code: 401,
    message: 'Invalid token'
  },
  notExpired: {
    success: false,
    code: 401,
    message: 'Token Not Expired'
  },
  forbidden: {
    success: false,
    code: 403,
    message: 'Forbidden',
  },
  alreadySignup: {
    success: false,
    code: 403, 
    message: 'Already Sign Up'
  },
  notFound: {
    success: false,
    code: 404,
    message: 'Not Found',
  },
  preconditionFailed: {
    success: false,
    code: 412,
    message: 'Precondition Failed',
  },
  serverError: {
    success: false,
    code: 500,
    message: 'Internal Server Error',
  },
}

export default messages