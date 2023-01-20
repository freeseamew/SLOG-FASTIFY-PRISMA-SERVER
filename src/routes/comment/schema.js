import schemaType from '../../lib/typeHelper.js'

const commentType = {
  id: schemaType.integer,
  articleId: schemaType.integer,
  content: schemaType.string,
  createdAt: schemaType.string,
  userId: schemaType.integer,
  userEmail: schemaType.string,  
}

const createCommentSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
    required: ['authorization'],
  },  
  body: {
    type: schemaType.object,
    required: ['articleId','content'],
    properties: {
      articleId: schemaType.integer,
      content: schemaType.string,
    }
  },
  response: {
    200: {
      type: schemaType.object,
      properties: commentType
    }
  }
}

const readCommentSchema = {
  params: {
    articleId: schemaType.integer,
  },
  response: {

    // 200: {
    //   type: schemaType.object,
    //   properties: {
    //     comments: {
    //       type: schemaType.array,
    //       items: {
    //         type: schemaType.object,
    //         properties: commentType
    //       }
    //     }
    //   }
    // }
    
    200: {
      comments: {
        type: schemaType.array,
        items: {
          type: schemaType.object,
          properties: commentType
        }
      }
    }
  }
}

const deleteCommentSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
    required: ['authorization'],
  },
  body: {
    // type:'object',
    type: schemaType.object,
    required:[ 'commentId','articleId'],
    properties: {
      commentId: schemaType.integer,
      articleId: schemaType.integer,  
    },
  },
  response: {
    200: {
      type: schemaType.object,
      properties: {
        commentId: schemaType.integer,
      },
    },
  },
}

export {
  createCommentSchema,
  readCommentSchema,
  deleteCommentSchema,
}