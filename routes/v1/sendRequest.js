module.exports = {
  method: "POST",
  path: "/v1/sendRequest",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      if (
        request.payload.name === undefined ||
        request.payload.name.length < 2 ||
        request.payload.description === undefined ||
        request.payload.description.length < 100
      )
        return resolve({
          response: false,
          message: "wrong name or description length",
        });
      else
        return request.app.db.query(
          "SELECT * FROM requests WHERE user_id = ?",
          [user],
          (err, result) => {
            if (err)
              return resolve({
                response: false,
                message: "something wen't wrong...",
              });
            else {
              if (result.length === 0) {
                request.app.db.query(
                  "SELECT status FROM users WHERE user_id = ?",
                  [user],
                  (err, result) => {
                    if (err)
                      return resolve({
                        response: false,
                        message: "something wen't wrong...",
                      });
                    else {
                      if (result[0].status == 2) {
                        return resolve({
                          response: false,
                          message: "you content-maker already",
                        });
                      } else {
                        request.app.db.query(
                          "INSERT INTO `requests`(`user_id`, `name`, `description`) VALUES (?, ?, ?)",
                          [
                            user,
                            request.payload.name,
                            request.payload.description,
                          ],
                          (err, result) => {
                            if (err)
                              return resolve({
                                response: false,
                                message: "something wen't wrong...",
                              });
                            else {
                              request.app.db.query(
                                "UPDATE users SET status = 2 WHERE user_id = ?",
                                [user],
                                (err, result) => {
                                  if (err)
                                    return resolve({
                                      response: false,
                                      message: "something wen't wrong...",
                                    });
                                  else {
                                    return resolve({ response: true });
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  }
                );
              } else {
                return resolve({
                  response: false,
                  message: "already requested",
                });
              }
            }
          }
        );
    });
  },
};
