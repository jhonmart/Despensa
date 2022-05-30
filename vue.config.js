module.exports = {
  publicPath: process.env.VUE_APP_LOCAL === "dev" ? "/" : "/Despensa",
  outputDir: "docs",
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Despensa";
      return args;
    });
  }
};
