/**
 * @type {import('semantic-release').GlobalConfig}
 */

export default {
    branches: ["main", { name: 'pre-release', prerelease: true }]
}