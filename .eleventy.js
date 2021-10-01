// require Luxon for date conversion
const { DateTime } = require("luxon");

// SVG sprite plugin
const svgSprite = require("eleventy-plugin-svg-sprite");

// Eleventy Image plugin
const Image = require("@11ty/eleventy-img");
const path = require('path');

// Image shortcode
async function imageShortcode(src, alt, sizes = "100vw") {
  let srcPrefix = `./_src/assets/images/`
  src = srcPrefix + src
  console.log(`Generating image(s) from:  ${src}`)
  if(alt === undefined) {
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`)
  }  
  let metadata = await Image(src, {
    widths: [400, 800],
    formats: ['avif', 'webp', 'jpeg'],
    urlPath: "/assets/images/",
    outputDir: "./_site/assets/images/",

    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src)
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`
    }
  })  
  let lowsrc = metadata.jpeg[0]
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1]  
  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
    }).join("\n")}
    <img
      src="${lowsrc.url}"
      width="${highsrc.width}"
      height="${highsrc.height}"
      alt="${alt}"
      loading="lazy"
      decoding="async">
  </picture>`
}

module.exports = function(eleventyConfig) {

  // open a browser window on --watch
  // eleventyConfig.setBrowserSyncConfig({
  //   open: true
  // });

  eleventyConfig.setBrowserSyncConfig({
		files: './_site/assets/css/**/*.css',
	});

  // shortcode for inserting the current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // shortcode for responsive images
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // convert date to [Month DD, YYYY], set timezone to UTC to ensure date is not off by one
  // https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html
  // https://www.11ty.dev/docs/dates/#dates-off-by-one-day 
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL);
  });

  // SVG sprite
  eleventyConfig.addPlugin(svgSprite, {
    path: "./_src/assets/icons",
    globalClasses: "icon",
    svgShortcode: "icon"
  });

  return {
    // set the input and output directories
    dir: {
      input: '_src',
      output: '_site'
    },
    // set default template engine to Nunjucks
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk'
  };

};