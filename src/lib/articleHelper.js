import db from '../lib/db.js';

const delay = (time) => {
  return new Promise(resolve => setTimeout(resolve, time))
}

const likeCompareArticles = async(articles, userId) => {

  // articles 목록에서 id값을 추출해 likes 가져오기
  // 가져온 likes와 articles를 비교해 likeMe 설정
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

// const flattenArticleObject = (article) => {
//   let newArticle = {
//     id: article.id,
//     content: article.content,
//     commentCount: article.commentCount,
//     likeCount: article.likeCount,
//     createdAt: article.createdAt,
//     userId: article.user.id,
//     userName: article.user.name,
//     userEmail: article.user.email,
//   }  
//   return newArticle
// }

const flattenArticleObject = (object) => {
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