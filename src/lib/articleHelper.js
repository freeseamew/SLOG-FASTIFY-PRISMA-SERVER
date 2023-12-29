import db from './db.js';

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

const likeCompareArticles = async(articles, userId) => {

  let likes = []

  const verifyLikeMe = (article={}, likes=[]) => {
    article.likeMe = false
    const likeArticle = likes.find(like => like.articleId === article.id)
    if(likeArticle) article.likeMe = true
      
    return article
  }

  if(userId) {
    const articlesIds = articles.map(article => article.id)

    likes  = await db.like.findMany({
      where: {
        userId: userId,
        articleId: {
          in: articlesIds
        }
      },
      select: {
        articleId: true
      }
    })
  }

  const articlesWithLike = articles.map(article => verifyLikeMe(article, likes))
  return articlesWithLike
}

const flattenArticleObject = (object = {}) => {
  let result = {}

  const makeStrFirstUpper = (str) => {
    let firstChar = str.charAt(0)
    let other = str.slice(1)
    const newStr = firstChar.toUpperCase() + other
    return newStr
  }

  for(const i in object) {
    if((typeof object[i]) === 'object' && !Array.isArray(object[i])) {
      const temp = flattenArticleObject(object[i])
      for(const j in temp) {
        result[i + makeStrFirstUpper(j)] = temp[j]
      }
    }
    result[i] = object[i]
  }
  return result
}

export {
  delay,
  likeCompareArticles,
  flattenArticleObject,
}