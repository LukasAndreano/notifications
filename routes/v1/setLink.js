module.exports = {
  method: "POST",
  path: "/v1/setLink",
  handler: (request) => {
    let user = request.query.vk_user_id;
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
                request.payload.tag === undefined ||
                request.payload.tag.trim().length < 2 ||
                request.payload.tag.trim().length > 60
              ) {
                return resolve({
                  response: false,
                  message: "wrong tag length",
                });
              } else {
                request.app.db.query(
                  "SELECT user_id FROM contentMakers WHERE link = ?",
                  [request.payload.tag.trim()],
                  (err, result) => {
                    if (err)
                      return resolve({
                        response: false,
                        message: "something wen't wrong...",
                      });
                    else {
                      if (result.length === 0) {
                        request.app.db.query(
                          "UPDATE contentMakers SET link = ? WHERE user_id = ?",
                          [request.payload.tag.trim(), user],
                          (err, result) => {
                            if (err)
                              return resolve({
                                response: false,
                                message: "something wen't wrong...",
                              });
                            else return resolve({ response: true });
                          }
                        );
                      } else {
                        return resolve({
                          response: false,
                          message: "already_setted",
                        });
                      }
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
