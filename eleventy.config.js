const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const projectRoot = __dirname;
const site = require("./src/_data/site.json");
const reverse = (s) => s.split("").reverse().join("");
const programs = require("./src/_data/programs.json");
const fs = require("fs");
const path = require("path");
// {{ p.field }} or {{ p.a.b }} inside fragment strings.
const interp = (str, p) =>
  str.replace(/\{\{\s*p\.([\w.]+)\s*\}\}/g, (_, path) => {
    const v = path.split(".").reduce((o, k) => o?.[k], p);
    if (v == null) throw new Error("Unknown field p." + path);
    return v;
  });

module.exports = function (eleventyConfig) {
  // Passthrough copy: files served as-is, no processing.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/files");


  const socialIcons = {
    facebook: "/img/fb.webp",
    instagram: "/img/insta.webp",
  };
    eleventyConfig.addShortcode(
      "socialLink",
      function (platform, url, label) {
        const icon = socialIcons[platform];
        return `<a href="${url}" class="social-link" target="_blank"` +
          ` rel="noopener noreferrer"><img src="${icon}"` +
          ` alt="" class="social-link__icon"><span>${label}</span></a>`;
      }
    );

    eleventyConfig.addFilter("coachPhotoExists", (photo) =>
  fs.existsSync(path.join("src/img/coaches", photo))
);
    eleventyConfig.addFilter("dateRange", (start, end) => {
      if (!start) return "TBA";
      end = end || start;
      const m = ["Jan","Feb","Mar","Apr","May","Jun",
                 "Jul","Aug","Sep","Oct","Nov","Dec"];
      const s = new Date(start), e = new Date(end);
      const f = (d) => `${m[d.getUTCMonth()]} ${d.getUTCDate()}`;
      const sy = s.getUTCFullYear(), ey = e.getUTCFullYear();
      if (start === end) return `${f(s)}, ${s.getUTCFullYear()}`;
      if (sy !== ey) return `${f(s)}, ${sy} – ${f(e)}, ${ey}`;
      if (s.getUTCMonth() !== e.getUTCMonth())
        return `${f(s)} – ${f(e)}, ${ey}`;
      return `${f(s)} – ${e.getUTCDate()}, ${ey}`;
    });

    eleventyConfig.addShortcode("snowregButton",
      function (url, label = "Register") {
        if (!url) {
          return `<p class="snowreg-btn snowreg-btn--pending">` +
            `Registration not yet open. check back soon</p>`;
        }
        return `<a href="${url}" class="snowreg-btn" target="_blank"` +
          ` rel="noopener noreferrer">${label}</a>`;
      });

  // Markdown: stock + typographer + heading anchors + attrs.
  const md = markdownIt({
    html: true,
    typographer: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: "after",
      symbol: "#",
    }),
  }).use(markdownItAttrs);
  // A note entry is a _fragments key, or literal text.
  eleventyConfig.addFilter("note", function (entry, p) {
    const frag = programs._fragments[entry];
    if (frag === undefined && !/\s/.test(entry))
      throw new Error("Unknown fragment: " + entry);
    const text = frag === undefined ? entry : frag;
    return md.renderInline(interp(text, p));
  });
  md.core.ruler.push("email_links", (state) => {
  for (const blk of state.tokens) {
    if (blk.type !== "inline") continue;
    const kids = blk.children;
    for (let i = 0; i < kids.length; i++) {
      const t = kids[i];
      if (t.type !== "link_open") continue;
      const href = t.attrGet("href") || "";
      if (!href.startsWith("email:")) continue;

      const key = href.slice(6);
      const addr = site.email[key];
      if (!addr) throw new Error("Unknown email: " + key);

      const rev = reverse(addr);
      t.attrs = t.attrs.filter((a) => a[0] !== "href");
      t.attrJoin("class", "email-link");
      t.attrSet("data-rev", rev);

      if (kids[i + 1].type === "link_close") {
        const span = new state.Token("html_inline", "", 0);
        span.content = '<span class="email-link__text">'
          + md.utils.escapeHtml(rev) + "</span>";
        kids.splice(i + 1, 0, span);
      }
    }
  }
});
  eleventyConfig.setLibrary("md", md);


    eleventyConfig.addFilter("markdownFile", function (filePath) {
      const fs = require("fs");
      const nodePath = require("path");
      const resolved = nodePath.join(projectRoot, filePath);
      const content = fs.readFileSync(resolved, "utf8");
      return md.render(content);
    });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
