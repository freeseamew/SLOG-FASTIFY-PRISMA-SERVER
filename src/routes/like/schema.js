import schemaType from '../../lib/typeHelper.js'

const likeType = {
  id: schemaType.integer,
  content: schemaType.string,
  likeCount: schemaType.integer,
  commentCount: schemaType.integer,
  createdAt: schemaType.string,
  userId: schemaType.integer,
  userName: schemaType.string,
  userEmail: schemaType.string,  
  likeMe: schemaType.boolean,
}

const postLikeSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
    required: ['authorization'],
  },
  params: {
    articleId: schemaType.integer,
  },
  response: {
    200: schemaType.boolean,
  }
}

const readLikeSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
    required: ['authorization'],
  },
  querystring: {
    pageNumber: schemaType.integer,
    // mode: schemaType.string,
  },
  response: {
    // 200: {
    //   type: 'array',
    //   likes: {
    //     type:'object',
    //     properties: likeType,
    //   }
    // }
    200: {
      type: schemaType.object,
      properties: {
        totalPageCount: schemaType.integer,
        articleList: {
          type: schemaType.array,
          items: {
            type: schemaType.object,
            properties: likeType,
          }
        }
      }
    }
  }
}

export {
  postLikeSchema,
  readLikeSchema,
}