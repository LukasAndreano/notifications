module.exports = {
  method: "POST",
  path: "/v1/startMailing",
  handler: (request) => {
    let user =request.query.vk_user_id;
    return new Promise((resolve) => {
      return request.app.db.query(
        "SELECT status FROM users WHERE user_id = ?",
        [user],
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            if (result[0].status == 1) {
              if (
                request.payload.text === undefined ||
                decodeURI(request.payload.text).trim().length < 50 ||
                decodeURI(request.payload.text).trim().length > 4000
              ) {
                return resolve({
                  response: false,
                  message: "wrong text length",
                });
              } else {
                request.app.db.query(
                  "SELECT name FROM contentMakers WHERE user_id = ?",
                  [user],
                  (err, result) => {
                    if (err)
                      return resolve({
                        response: false,
                        message: "something wen't wrong...",
                      });
                    else {
                      request.app.db.query(
                        "INSERT INTO `queue`(`user_id`, `name`, `message`) VALUES (?, ?, ?)",
                        [
                          user,
                          result[0].name,
                          decodeURI(request.payload.text).trim(),
                        ],
                        (err, result) => {
                          if (err)
                            return resolve({
                              response: false,
                              message: "something wen't wrong...",
                            });
                          else return resolve({ response: true });
                        }
                      );
                    }
                  }
                );
              }
            } else {
              return resolve({ response: false, message: "don't have access" });
            }
          }
        }
      );
    });
  },
};
