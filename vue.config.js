module.exports = {
  publicPath: "./",
  outputDir: "docs",
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Despensa";
      return args;
    });
  }
};