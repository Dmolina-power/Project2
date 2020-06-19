const Unsplash = require("unsplash-js").default;
const clientId = process.env.UNSPLASH_CLIENT_ID;
const unsplash = new Unsplash({ accessKey: clientId });
module.exports = unsplash;
