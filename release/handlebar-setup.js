// eslint-disable-next-line @typescript-eslint/no-require-imports
const Handlebars = require("handlebars");
Handlebars.registerHelper("removeEmoji", function (text) {
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F900}-\u{1F9FF}|\u{1F1E0}-\u{1F1FF}]/gu,
      ""
    )
    .trim();
});
Handlebars.registerHelper("lowerCase", function (text) {
  return text.toLowerCase();
});

module.exports = Handlebars;
