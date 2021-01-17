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
    return image.match(/\.(jpeg|jpg|png|gif|svg)/g) != null
  },
  checkIfUrlImage: (url) => {
    let checkIfUrl = Helpers.checkIfUrl(url);
    let checkIfImage = Helpers.checkIfImage(url);
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

  checkSneakerObj: (sneakerObj) => {
    let checkUuid = Helpers.checkIfUuid(sneakerObj.uuid);
    let checkProductBrand = Helpers.checkIfString(sneakerObj.product_brand);
    let checkProductName = Helpers.checkIfString(sneakerObj.product_name);
    let checkProductPrice = Helpers.checkIfPriceHasEuro(sneakerObj.product_price);
    let checkProductSalePrice = Helpers.checkIfPriceHasEuro(sneakerObj.product_sale_price);
    let checkProductSale = Helpers.checkIfBoolean(sneakerObj.product_sale);
    let checkProductImage = Helpers.checkIfUrlImage(sneakerObj.product_image);
    let checkProductUrl = Helpers.checkIfUrl(sneakerObj.product_url);
    let checkProductAvailable= Helpers.checkIfArray(sneakerObj.product_available);
    let checkProductColors= Helpers.checkIfArray(sneakerObj.product_colors);
    let checkBrandUuid= Helpers.checkIfUuid(sneakerObj.brand_uuid);
    if(!checkUuid || !checkProductBrand || !checkProductName || !checkProductPrice||!checkProductSalePrice || !checkProductUrl || !checkProductSale || !checkProductImage || !checkProductAvailable|| !checkProductColors|| !checkBrandUuid){
      return false;
    }
    return true;
  },
  checkBrandObj: (brandObj) => {
    let checkUuid = Helpers.checkIfUuid(brandObj.uuid);
    let checkBrandName = Helpers.checkIfString(brandObj.brand_name);
    let checkBrandImage = Helpers.checkIfUrlImage(brandObj.brand_logo);
    let checkBrandUrl = Helpers.checkIfUrl(brandObj.brand_url);
    if(!checkUuid || !checkBrandName || !checkBrandImage || !checkBrandUrl){
      return false;
    }
    return true;
  },
}





module.exports = Helpers