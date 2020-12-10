
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },
  checkTitleLength: (title, maxLength) => {
    if (typeof title !== "string") {
      return false
    }
    if (title[0].toUpperCase() !== title[0]) {
      return false
    }
    if (title.length >= 50) {
      return false
    }
    return title
  },
  checkContentLength: (title, maxLength) => {
    if (title.length > maxLength) {
      return false
    }
    return true
  },
  checkIfString: (title) => {
    if (typeof title !== "string") {
      return false
    }
    return true
  }
}





module.exports = Helpers