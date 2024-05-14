module.exports = {
    i18n: {
      defaultLocale: "en",
      locales: ["en", "mr", "hi"],
      localeDetection: false,
    },
    fallbackLng: 'en',
    // localePath:
    //   typeof window === "undefined"
    //     ? require("path").resolve("./public/locales/")
    //     : "/locales",
    ns: ["common"],
    reloadOnPrerender: process.env.NODE_ENV === 'development',
  };
  