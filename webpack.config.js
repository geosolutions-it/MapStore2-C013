const path = require("path");

const extractThemesPlugin = require('./MapStore2/build/themes.js').extractThemesPlugin;

module.exports = require('./MapStore2/build/buildConfig')(
    {
        'MapStore2-C013': path.join(__dirname, "js", "app"),
        'MapStore2-C013-embedded': path.join(__dirname, "MapStore2", "web", "client", "product", "embedded"),
        'MapStore2-C013-api': path.join(__dirname, "MapStore2", "web", "client", "product", "api")
    },
    {
        "themes/default": path.join(__dirname, "assets", "themes", "default", "theme.less")
    },
    {
        base: __dirname,
        dist: path.join(__dirname, "dist"),
        framework: path.join(__dirname, "MapStore2", "web", "client"),
        code: [path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client")]
    },
    extractThemesPlugin,
    false,
    "dist/",
    '.MapStore2-C013',
    [],
    {
        "@mapstore": path.resolve(__dirname, "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, "js")
    }
);
