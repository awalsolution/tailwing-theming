/**
 * @type {import('semantic-release').GlobalConfig}
 */

export default {
  branches: ['main', { name: 'pre-release', prerelease: true }],
  repositoryUrl: 'https://github.com/awalsolution/tailwing-theming.git',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'docs/CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
}
