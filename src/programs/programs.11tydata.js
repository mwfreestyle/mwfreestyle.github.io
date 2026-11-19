// Applies to every file in src/programs/.
module.exports = {
  layout: "program.njk",

  eleventyComputed: {
    p: (data) => data.programList[data.program],
    title: (data) => data.programList[data.program].name,
    description: (data) => data.programList[data.program].blurb,
    permalink: (data) =>
      "/" + data.programList[data.program].slug + "/",
  },
};
