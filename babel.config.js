module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@nav": "./src/navigation",
            "@screens": "./src/screens",
            "@components": "./src/components",
            "@store": "./src/store",
            "@utils": "./src/utils",
            "@theme": "./src/theme",
            "@api": "./src/api",
            "@services": "./src/services",
            "@context": "./src/context",
          },
        },
      ],
    ],
  };
};
