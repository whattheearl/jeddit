/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  "branches": [
    "main",
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    ["@semantic-release/exec", {
      "verifyConditionsCmd": "echo 'PREPARE'; docker build .",
      "publishCmd": "./scripts/publish.sh ${nextRelease.version}"
    }],
  ]
}
