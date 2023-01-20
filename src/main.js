import Fastify from 'fastify'
import routes from './routes/index.js'
import { checkStartUser, checkStartArticle } from './startup/startup.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fasstifyCookie from '@fastify/cookie';
import cors from '@fastify/cors';

import * as dotenv from 'dotenv'
dotenv.config()

// import swaggerConfig from './config/swaggerConfig.js';

const fastify = Fastify({
  logger: true
})

fastify.register(cors,{  
  // origin: "http://127.0.0.1:3012",
  origin: true,
  credentials: true,
})

fastify.register(fasstifyCookie, {  
  // domain:'http://127.0.0.1:5173/',
  domain:'http://localhost/',
  secret: "my-secret", // for cookies signature
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}  // options for parsing cookies  
})

// fastify.register(fastifySwagger, swaggerConfig)
fastify.register(fastifySwagger, {  
  swagger: {
    info: {
      title: 'Slog Api',
      description: 'Slog에 사용되는 REST API 명세서 입니다. ',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})

fastify.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})


// fastify.register(fastifySwaggerUi, swaggerConfig)

fastify.register(routes)

const start = async () => {
  try {
    await checkStartUser()
    await checkStartArticle()
    
    await fastify.listen({ port: 3000 })
    // await fastify.swagger()
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()