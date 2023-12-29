import db from '../lib/db.js';
import { ALL, MY } from '../lib/constants.js';
import appMessages from '../lib/appMessages.js';
import { delay, likeCompareArticles, flattenArticleObject } from '../lib/articleHelper.js';
import { getCurrentDate } from '../lib/timeHelper.js';

const createArticle = async (req, rep) => {

  const { title, content } = req.body
  const userId = req.headers.user.id
  const userEmail = req.headers.user.email

  try {

    const values = {
      title: title,
      content: content,
      userId: userId, 
      createdAt: getCurrentDate(),
    }

    const result = await db.article.create({
      data: values,
    })

    result.userEmail = userEmail
    result.likeMe = false

    return result
  }
  catch(err) {
    return appMessages.notFound
  }
}

const readArticleList = async (req, rep) => {
  const { pageNumber=0, mode=ALL } = req.query
  const userId = req.headers.user.id
  const pageSize = 10
  let skip = 0

  if(pageNumber > 1) skip = ((pageNumber - 1) * pageSize)

  let totalArticleCount = 0
  let totalPageCount = 0
  let articles = []
  let articlesWithLikeMe = []
  let flattenArticles = []

  try {
    if(mode === ALL) {      
      
      articles = await db.article.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },         
        orderBy: {
          id: 'desc',
        },        
        skip: skip,
        take: pageSize,
      })

      totalArticleCount = await db.article.count()            
    }

    if(mode === MY) {      

      if(!userId) throw appMessages.badRequest

      articles = await db.article.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },        
        orderBy: {
          id: 'desc',
        },
        skip: skip,
        take: pageSize,
      })      

      totalArticleCount = await db.article.count({
        where: {
          userId: userId,
        }
      })      
    }        

    totalPageCount = Math.ceil(totalArticleCount / pageSize)
    flattenArticles = articles.map(article => flattenArticleObject(article))
    
    console.log(`articles: ${JSON.stringify(articles) }`)

    await likeCompareArticles(flattenArticles, userId)
    await delay(500)

    return {
      totalPageCount: totalPageCount,
      articleList: flattenArticles,
    }
  }
  catch(err) {
    throw err   
  }
}

const readArticleOne = async (req, rep) => {

  const { articleId } = req.params
  const userId = req.headers.user.id

  let flattenArticle = {}
  let articlesWithLikeMe = {}

  try {
    const articleOne = await db.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,            
          }
        }
      },
    })

    flattenArticle = flattenArticleObject(articleOne)
    return flattenArticle
  }
  catch(err) {
    throw appMessages.badRequest
  }
}

const updateArticle = async (req, rep) => {
  
  const { articleId, content } = req.body

  try {

    await verifyArticleUser(articleId, req.headers.user.id)

    const result = await db.article.update({
      where: {
        id: articleId,
      },
      data: {
        content: content,
      }
    })

    result.userEmail = req.headers.user.email
    return result
  }
  catch(err) {
    throw err
  }
}

const deleteArticle = async (req, rep) => {
  
  const { articleId } = req.params
  const userId = req.headers.user.id

  await verifyArticleUser(articleId, userId)
  
  try {

    await db.comment.deleteMany({
      where: {
        articleId: articleId
      },
    })

    await db.like.deleteMany({
      where: {
        articleId: articleId
      }
    })

    const result = await db.article.delete({
      where: {
        id: articleId,
      },
    })

    return result
  }
  catch(err) {
    throw appMessages.notFound
    // throw err
  }
}

const verifyArticleUser = async (articleId, userId) => {
  
  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId
      },
      select: {
        userId: true
      }
    })

    if(article.userId !== userId) throw appMessages.forbidden

    return
  }
  catch(err) {
    throw err
  }
}

export {
  createArticle,
  readArticleList,
  readArticleOne,
  updateArticle,
  deleteArticle,
}