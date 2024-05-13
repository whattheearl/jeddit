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
      "verifyConditionsCmd": "./scripts/docker-build.sh",
      "publishCmd": "./scripts/docker-publish.sh ${nextRelease.version}; ./scripts/docker-publish.sh latest"
    }],
  ]
}
