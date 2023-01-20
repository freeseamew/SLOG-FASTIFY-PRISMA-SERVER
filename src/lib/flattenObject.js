export default function flattenObject(object) {

  let result = {}

  const makeStrFirstUpper = (str) => {
    let firstChar = str.charAt(0)
    let other = str.slice(1)
    const newStr = firstChar.toUpperCase() + other
    return newStr
  }

  for(const i in object) {
    if((typeof object[i]) === 'object' && !Array.isArray(object[i])) {
      const temp = flattenObject(object[i])
      for(const j in temp) {
        result[i + makeStrFirstUpper(j)] = temp[j]
      }
    }
    result[i] = object[i]
  }
  return result
}
