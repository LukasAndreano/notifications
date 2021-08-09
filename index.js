const Hapi = require("@hapi/hapi");
const crypto = require("crypto");
const config = require("./config");

const init = async () => {
  const server = Hapi.server({
    port: 6666,
    host: "localhost",
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  await server.start();

  await server.register({
    plugin: require("hapi-plugin-mysql"),
    options: {
      host: config.DATABASE_HOST,
      user: config.DATABASE_USER,
      database: config.DATABASE_NAME,
      password: config.DATABASE_PASSWORD,
    },
  });

  server.ext('onRequest', function (request, reply) {
    let searchOrParsedUrlQuery = request.query;

    let sign;
    const queryParams = [];
    const processQueryParam = (key, value) => {
      if (typeof value === "string") {
        if (key === "sign") {
          sign = value;
        } else if (key.startsWith("vk_")) {
          queryParams.push({ key, value });
        }
      }
    };
    if (typeof searchOrParsedUrlQuery === "string") {
      const formattedSearch = searchOrParsedUrlQuery.startsWith("?")
        ? searchOrParsedUrlQuery.slice(1)
        : searchOrParsedUrlQuery;
      for (const param of formattedSearch.split("&")) {
        const [key, value] = param.split("=");
        processQueryParam(key, value);
      }
    } else {
      for (const key of Object.keys(searchOrParsedUrlQuery)) {
        const value = searchOrParsedUrlQuery[key];
        processQueryParam(key, value);
      }
    }
    if (!sign || queryParams.length === 0) {
      return false;
    }
    const queryString = queryParams
      .sort((a, b) => a.key.localeCompare(b.key))
      .reduce((acc, { key, value }, idx) => {
        return (
          acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`
        );
      }, "");
    const paramsHash = crypto
      .createHmac("sha256", "GgDylDJ4jv7CKRGTaD0o")
      .update(queryString)
      .digest()
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=$/, "");

    if (paramsHash !== sign) {
      request.setUrl("/v1/error");
    }
    return reply.continue;
  });

  server.route({
    method: "POST",
    path: "/v1/error",
    handler: () => {
      return {
        response: false,
        message: "wrong start params",
      };
    },
  });

  server.route(require("./routes/v1/index"));

  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
