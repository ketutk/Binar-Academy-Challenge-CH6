const ImageKit = require("imagekit");
const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_ENDPOINT_URL } = process.env;
// console.log(IMAGEKIT_PRIVATE_KEY.toString("base64"));
// console.log(IMAGEKIT_PUBLIC_KEY);
// console.log(IMAGEKIT_ENDPOINT_URL);
module.exports = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_ENDPOINT_URL,
});
