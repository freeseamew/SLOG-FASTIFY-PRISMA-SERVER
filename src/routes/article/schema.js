import schemaType from '../../lib/typeHelper.js';

const articleType = {
  id: schemaType.integer,
  content: schemaType.string,
  likeCount: schemaType.integer,
  commentCount: schemaType.integer,
  createdAt: schemaType.string,
  userId: schemaType.integer,
  userEmail: schemaType.string,
  likeMe: schemaType.boolean,
}

const createArticleSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
    required: ['authorization'],
  },
  body: {
    type: schemaType.object,
    required: ['content'],
    properties: {
      content: schemaType.string,
    },
  },
  response: {
    200: {
      type: schemaType.object,
      properties: articleType,
    },
  },
}

const readArticlesSchema = {
  headers: {
    type: schemaType.object,
    properties: {
      authorization: schemaType.string
    },
  },
  querystring: {
    pageNumber: schemaType.integer,
    mode: schemaType.string,
  },
  response: {
    200: {
      type: schemaType.object,
      properties: {
        totalPageCount: schemaType.integer,
        articleList: { 
          type: schemaType.array, 
          items: { 
            type: schemaType.object, 
            properties: articleType 
          },
        },                       
      },
    }
  }
}

const readArticleSchema = {
  params: {
    articleId: schemaType.integer,
  },
  response: {
    200: {
      type: schemaType.object,
      properties: articleType,
    }
  }
}

const updateArticleSchema = {
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
    },
  },
  response: {
    200: {
      type: schemaType.object,
      properties: articleType,
    }
  }
}

const deleteArticleSchema = {
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
    200: {
      type: schemaType.object,
      properties: articleType,
    },
  },
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
    200: {
      type: schemaType.object,
      properties: {
        totalPageCount: schemaType.integer,
        articleList: {
          type: schemaType.array,
          items: {
            type: schemaType.object,
            properties: articleType,
          }
        }
      }
    }
  }
}


export {
  articleType,
  createArticleSchema,
  readArticlesSchema,
  readArticleSchema,
  updateArticleSchema,
  deleteArticleSchema,
  postLikeSchema,
  readLikeSchema,  
}