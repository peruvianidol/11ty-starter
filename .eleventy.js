module.exports = function(eleventyConfig) {
  // Set directories to pass through to the _site folder
  eleventyConfig.addPassthroughCopy("_src/assets/images/");

  // Watch scss folder for changes
  eleventyConfig.addWatchTarget("./_src/assets/scss/");

  // open a browser window on --watch
  eleventyConfig.setBrowserSyncConfig({
    open: true,
  });

  // shortcode for inserting the current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    // set the input and output directories
    dir: {
      input: '_src',
      output: '_site'
    }
  };

};