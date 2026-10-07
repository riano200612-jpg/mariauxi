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
  eleventyConfig.addPassthroughCopy("favicon-192x192.png");
  eleventyConfig.addPassthroughCopy("favicon-512x512.png");
  eleventyConfig.addPassthroughCopy("favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("logo.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
