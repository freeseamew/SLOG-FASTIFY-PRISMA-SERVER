import db from '../lib/db.js';
import { ALL, MY } from '../lib/constants.js';
import appMessages from '../lib/appMessages.js';
import { delay, likeCompareArticles, flattenArticleObject } from '../lib/articleHelper.js';

const createArticle = async (req, rep) => {

  const { title, content } = req.body
  const userId = req.headers.user.id
  const userEmail = req.headers.user.email

  try {

    const values = {
      title: title,
      content: content,
      userId: userId, 
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

  // const { pageNumber=0, mode=NOMAL_FETCH } = req.query
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

    // if(mode === NOMAL_FETCH) {
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
    
    // if(mode === MY_FETCH) {
    if(mode === MY) {      

      // const userId = req.headers.user.id
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
    articlesWithLikeMe = await likeCompareArticles(flattenArticles, userId)

    await delay(500)

    return {
      totalPageCount: totalPageCount,
      articleList: flattenArticles,
    }
  }
  catch(err) {
    // error은 throw 로 해야 해당 오류가 클라이언트로 전달됨. 아니면 500에러가 발생
    // throw appMessages.notFound
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
  
  /**
   * 게시글의 경우 fk로 연결된 덧글이 있으면 삭제가 안됨(RDB구조상)
   * 해결방법1. article에 게시글 상태 컬럼을 두고 삭제 해당 상태값을 false등으로 해서 게시글이 삭제된 것처럼 해줌
   * 해경방법2. 해당 article과 연결된 comment를 먼저 삭제 후 article삭제
   * 
   * 우리의 경우 예제프로젝트 이므로 2번을 통해서 진행예정
   */ 

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