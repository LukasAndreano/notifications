module.exports = {
  method: "POST",
  path: "/v1/loadServices",
  handler: (request) => {
    return new Promise((resolve) => {
      return request.app.db.query(
        "SELECT id, name, description, img FROM services WHERE public = 1",
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else return resolve({ response: result });
        }
      );
    });
  },
};
