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
      "verifyConditionsCmd": "docker build .",
      "publishCmd": `
        docker build -t ghcr.io/whattheearl/jeddit:latest -t ghcr.io/whattheearl/jeddit:${nextRelease.version} .
        echo $GH_TOKEN | docker login ghcr.io -u whattheearl --password-stdin
        docker push ghcr.io/whattheearl/jeddit --all-tags
      `}
    ],
  ]
}
