/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer', // figure out bump type (major/minor/patch)
    '@semantic-release/release-notes-generator', // generate changelog text
    [
      '@semantic-release/git',
      {
        assets: ['package.json'], // only bump version in package.json
        message: 'chore(release): bump version to ${nextRelease.version}',
        author: 'tarteelafattahibrahim@gmail.com',
      },
    ],
    '@semantic-release/github',
  ],
};
