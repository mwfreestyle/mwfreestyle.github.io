const data = require("./programs.json");
const fs = require("fs");
const path = require("path");

const dashSlug = (s) =>
  s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

module.exports = () => {
  const out = {};

  for (const [key, prog] of Object.entries(data)) {
    // Skip _defaults and _fragments.
    if (key.startsWith("_")) continue;
    if (!prog.type) throw new Error("Missing type: " + key);
    const slug = dashSlug(key);
    const f = path.join(__dirname, "../programs", slug + ".md");
    if (!fs.existsSync(f)) throw new Error("No page file: " + key);

    out[key] = {
      ...data._defaults,
      ...prog,
      slug: dashSlug(key),
    };
  }

  return out;
};
