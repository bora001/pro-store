// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getMainTemplate } = require("./release/getTemplate.js");
// eslint-disable-next-line @typescript-eslint/no-require-imports
require("./release/handlebar-setup.js");

module.exports = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { scope: "no-release", release: false },
          { scope: "breaking", release: "major" },
          { type: "docs", release: "patch" },
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "refactor", scope: "core-*", release: "minor" },
          { type: "refactor", release: "patch" },
          { type: "style", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "move", release: false },
          { type: "remove", release: false },
          { type: "chore", release: false },
          { type: "ci", release: false },
          { type: "test", release: false },
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
          headerPattern: /^(\w*)(?:\s*:)?\s*(.*)$/,
          headerCorrespondence: ["type", "subject"],
        },
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "🚀 New Features", hidden: false },
            { type: "fix", section: "🐛 Bug Fixes", hidden: false },
            {
              type: "perf",
              section: "⚡ Performance Improvements",
              hidden: false,
            },
            { type: "refactor", section: "🔧 Code Refactoring", hidden: false },
            {
              type: "docs",
              section: "📚 Documentation Updates",
              hidden: false,
            },
            {
              type: "style",
              section: "💄 Styles and Formatting",
              hidden: false,
            },
            { type: "revert", section: "🕐 Reverts", hidden: false },
            { type: "ci", section: "💫 CI/CD Updates", hidden: false },
            { type: "test", section: "✅ Test Enhancements", hidden: true },
            { type: "move", section: "🚚 File Movement", hidden: true },
            { type: "remove", section: "🗑 Removed Features", hidden: true },
          ],
        },
        writerOpts: {
          mainTemplate: getMainTemplate(),
        },
        parserOpts: {
          issuePrefixes: ["#"],
          headerPattern: /^(\w*)(?:\s*:)?\s*(.*)$/,
          headerCorrespondence: ["type", "subject"],
        },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle: "# 🚀 RELEASE NOTES",
      },
    ],
    [
      "@semantic-release/monorepo",
      {
        packages: [
          "apps/*",
          "packages/*"
        ],
        message: "chore(release): publish",
        monorepoPrefix: true
      }
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
        tarballDir: "dist",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: ["CHANGELOG.md"],
        failComment: false,
        generateReleaseNotes: true,
      },
    ],
  ],
  git: {
    tag: true,
  },
};
