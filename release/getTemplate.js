// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");
const getMainTemplate = () => {
  return fs.readFileSync(path.resolve(__dirname, "template.hbs"), "utf-8");
};
module.exports = { getMainTemplate };
