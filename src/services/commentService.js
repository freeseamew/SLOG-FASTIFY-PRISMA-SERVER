import db from '../lib/db.js'
import { flattenArticleObject } from '../lib/articleHelper.js';
import appMessages from '../lib/appMessages.js'

const createComment = async (req, rep) => {

  const { articleId, content } = req.body

  const userId = req.headers.user.id
  const userEmail = req.headers.user.email

  const values = {
    content: content,
    userId: userId,
    articleId: articleId,
  }

  try {

    const result = await db.comment.create({
      data: values,
    })
    
    const newComment = {
      ...result,
      'userId': userId,
      'userEmail': userEmail,
    }

    await db.article.update({
      where: {
        id: articleId,
      },
      data: {
        commentCount: {increment: 1}
      },
    })

    return newComment

  }
  catch(err) {
    throw appMessages.notFound
  }
}

const readComment = async (req, rep) => {
  
  const { articleId } = req.params
  let newReslut = []

  try {

    const result = await db.comment.findMany({
      where: {
        // articleId: Number(articleId) ,
        articleId: articleId
      },
      include : {
        user: {
          select: {
            id: true,
            email: true,
          }
        }
      }
    })
    
    result.map(comment => {
      newReslut = [...newReslut, flattenArticleObject(comment)]
    })

    return {
      comments: newReslut
    }
  }
  catch(err) {
    throw appMessages.notFound
  }
}

const deleteComment = async (req, rep) => {

  const { articleId, commentId } = req.body
  const userId = req.headers.user.id
  
  await verifyCommentUser(commentId, userId)

  try {
    const result = await db.comment.delete({
      where: {
        id: commentId,
      }
    })

    const checkCommentCount = await db.article.findFirst({
      where: {
        id: articleId,
      },
      select: {
        commentCount: true,
      },
    })

    if(checkCommentCount.commentCount > 0) {
      await db.article.update({
        where: {
          id: articleId,
        },
        data: {
          commentCount: {decrement: 1}
        }
      })
    }
    
    return {
      "commentId": result.id
    }
  }
  catch(err) {
    throw appMessages.notFound
  }
}

const verifyCommentUser = async (commentId, userId) => {
 
  try {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId
      },
      select: {
        userId: true
      }
    })

    if(comment.userId !== userId) throw appMessages.forbidden
  }
  catch(err) {
    throw err
  }
}

export {
  createComment,
  readComment,
  deleteComment,
}