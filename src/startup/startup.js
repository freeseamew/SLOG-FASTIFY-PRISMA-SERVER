import db from '../lib/db.js'
import { generateHash } from '../lib/authHelper.js';

const pwd = '1234'
const hashPwd = await generateHash(pwd)

const checkStartUser = async () => {

  const userCount = await db.user.count({})

  if(userCount === 0) {

    let count = 1
    while(count <= 2) {

      const value = {
        email: `user${count}@user${count}.com`,
        password: hashPwd,
        name: `user${count}`,
      }
  
      await db.user.create({
        data: value,
      })

      count += 1
    }

    console.log(`created user!`);
  }
}

const checkStartArticle = async () => {
  
  const articleCount = await db.article.count({})

  if(articleCount === 0) {
    
    const user = await db.user.findFirst({
      orderBy: {
        id: 'asc'
      }
    })

    let count = 1
    while(count <= 50) {
      let values = {
        content: `content_${count}`,
        userId: user.id,
      }

      await db.article.create({
        data: values,
      })

      count += 1
    }

    console.log(`created articles!`);
  }
}

export {
  checkStartUser,
  checkStartArticle,
}