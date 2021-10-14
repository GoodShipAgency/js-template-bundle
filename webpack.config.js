var Encore = require('@symfony/webpack-encore');

// Set the node env manually, tailwind purge uses node_env to run purgecss.
process.env.NODE_ENV = Encore.isProduction() ? 'production' : 'development';

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('dist/')
    .setPublicPath('/dist')
    .addEntry('index', './src/index.js')
    .disableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    });

//.enableTypeScriptLoader()
let config = Encore.getWebpackConfig();
config.output = {
    ...config.output,
    library: {
        name: '@mashbo/js-template-bundle',
        type: 'umd',
    },
}
module.exports = config;
