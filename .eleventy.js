const { DateTime } = require("luxon");
const sass = require("sass");

module.exports = function(eleventyConfig) {

  eleventyConfig.addWatchTarget("./_src/assets/scss/");
  eleventyConfig.addPassthroughCopy("./_src/assets/images/");
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL);
  });

  return {
    dir: {
      input: '_src',
      output: '_site'
    },
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };
};