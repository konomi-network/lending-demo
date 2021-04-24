// https://github.com/reactioncommerce/reaction-component-library/issues/399#issuecomment-467860022
// Work around for issue in loading .mjs files
module.exports = function override(webpackConfig) {
  webpackConfig.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: 'javascript/auto',
  });

  return webpackConfig;
};
