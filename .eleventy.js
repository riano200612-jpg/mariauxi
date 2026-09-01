module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("videos");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("contenido");
  eleventyConfig.addPassthroughCopy("docum");
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
