const {
  v1: uuidv1
} = require('uuid');

const Helpers = {
  generateUUID: () => {
    const uuid = uuidv1();
    return uuid;
  },
  checkContentLength: (title, maxLength) => {
    if (title.length > maxLength) {
      return false
    }
    return true
  },
  checkIfString: (title) => {
    if (typeof title === "string") {
      return true
    }
    return false
  },
  checkIfPriceHasEuro: (price) => {
    if (price.startsWith("€")) {
      return true
    }
    return false
  },
  checkIfUrl: (url) => {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
  },
  checkIfImage: (image) => {
    return (image.match(/\.(jpeg|jpg|gif|png)$/) != null);
  },
  checkIfUrlImage: (url) => {
    let checkIfUrl = Helpers.checkIfUrl(url);
    let checkIfImage = Helpers.checkIfUrl(url);
    return !!checkIfUrl && !!checkIfImage;
  },
  checkIfArray: (array) => {
    return (typeof JSON.parse(array) === "object");
  },
  checkIfBoolean: (boolean) => {
    return (typeof boolean === "boolean");
  },
  checkIfUuid: (uuid) => {
    let pattern = new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    return !!pattern.test(uuid);
  },
}





module.exports = Helpers