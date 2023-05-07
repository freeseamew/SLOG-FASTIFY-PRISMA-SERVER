import db from '../lib/db.js'
import appMessages from '../lib/appMessages.js'
import { delay } from '../lib/articleHelper.js'

const addLike = async (req, rep) => {

  const { articleId } = req.params
  const userId = req.headers.user.id

  const values = {
    userId: userId,
    articleId: articleId,
  }

  try {

    const likeCheck = await db.like.count({
      where : {
        userId: userId,
        articleId: articleId,
      },
    })

    if(likeCheck === 0) {
      await db.like.create({
        data: values,
      })
  
      await db.article.update({
        where: {
          id: articleId,
        },
        data: {
          likeCount: {increment: 1}
        },
      })
  
      return true
    }
    else {
      throw appMessages.likeAddError
    }

  }
  catch(err) {
    throw appMessages.likeAddError
  }
}

const cancelLike = async (req, rep) => {

  const { articleId } = req.params
  const userId = req.headers.user.id

  try {

    const likeCheck = await db.like.count({
      where: {
        userId: userId,
        articleId: articleId,
      }
    })

    if(likeCheck > 0) {
      await db.like.deleteMany({
        where: {          
          userId: userId,
          articleId: articleId,      
        }
      })
  
      await db.article.update({
        where: {
          id: articleId,
        },
        data: {
          likeCount: {decrement: 1},
        },
      })
  
      return true
    }
    else {
      throw appMessages.likeCancelError
    }

  }
  catch(err) {
    throw err
  }
}

const readLikes = async (req, rep) => {

  const { pageNumber=0 } = req.query
  const userId = req.headers.user.id
  const pageSize = 10
  let skip = 0
  
  if(pageNumber > 1) skip = ((pageNumber - 1) * pageSize)

  let totalLikeCount = 0
  let totalPageCount = 0  
  let likeArticles = []
  let flattenArticles = []

  try {
    likeArticles = await db.like.findMany({
      where: {
        userId: userId,
      },
      include: {
        article: {
          select: {
            id: true,
            content: true,
            commentCount: true,
            likeCount: true,
            createdAt: true,
            user: true
          },
        },
        // user: {
        //   select: {
        //     id: true,
        //     name: true,
        //     email: true,
        //   },
        // },
      },
      orderBy: {
        id: 'desc',
      },
      skip: skip,
      take: pageSize,      
    })

    totalLikeCount = await db.like.count({
      where: {
        userId: userId,
      }
    })

    totalPageCount = Math.ceil(totalLikeCount / pageSize)

    flattenArticles = likeArticles.map(article => {
      let newArticle = {
        id: article.article.id,
        content: article.article.content,
        commentCount: article.article.commentCount,
        likeCount: article.article.likeCount,
        createdAt: article.article.createdAt,
        // userId: article.user.id,
        // userName: article.user.name,
        // userEmail: article.user.email,
        userId: article.article.user.id,
        userName: article.article.user.name,
        userEmail: article.article.user.email,        
        likeMe: true,
      }

      return newArticle
    })

    await delay(500)
    
    return {
      totalPageCount: totalPageCount,
      articleList: flattenArticles,
    }
  }
  catch(err) {
    throw appMessages.notFound
  }
}

export {
  addLike,
  cancelLike,
  readLikes,
}