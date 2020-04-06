const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/pnm_music/" : "./",
  outputDir: "pnm_music",
};
