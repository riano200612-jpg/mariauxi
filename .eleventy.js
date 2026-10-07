module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("videos");
  eleventyConfig.addPassthroughCopy("img/uploads");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("contenido");
  eleventyConfig.addPassthroughCopy("docum");
  eleventyConfig.addPassthroughCopy("manifest.json");
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
