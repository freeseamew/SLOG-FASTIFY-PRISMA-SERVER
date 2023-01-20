import { Type } from '@sinclair/typebox';
import schemaType from '../../lib/typeHelper.js';
import { restMessage } from '../commonSchema.js';

const loginSchema = {
  body:{ 
    type: schemaType.object,
    required: ['email', 'pwd'],
    properties: {
      email: schemaType.string,
      pwd: schemaType.string,
    },
  },
  response: {
    201: {
      type: schemaType.object,
      // properties: {
      //   accessToken: schemaType.string,
      //   refreshToken: schemaType.string,
      // }
      // properties: restMessage
      properties: {
        id: schemaType.integer,
        email: schemaType.string,
        Authorization: schemaType.string,
      }
    }
  }
}

const registerSchema = {
  body: {
    type: schemaType.object,
    required: ['email', 'pwd'],
    properties: {
      email: schemaType.string,
      pwd: schemaType.string,
    },
  },
  response: {
    201: schemaType.boolean
  }
}

const isLoginSchema = {
  response: {
    200: {
      type: schemaType.object,
      properties: {
        id: schemaType.integer,
        email: schemaType.string,    
        Authorization: schemaType.string,    
      }
    }
  }
}

const logoutSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
    required: ['authorization'],
  }, 
  response: {
    205: {
      type: schemaType.object,
      properties: restMessage
    }
  }
}

const refreshSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      refresh_token: schemaType.string,
    },
  },  
  response: {
    200: {
      type: schemaType.object,
      properties: {
        id: schemaType.integer,
        email: schemaType.string,    
        Authorization: schemaType.string,    
      }
    }    
  }
}

export {
  loginSchema,
  logoutSchema,
  isLoginSchema,
  registerSchema,
  refreshSchema,
}