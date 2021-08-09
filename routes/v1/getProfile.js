module.exports = {
  method: "POST",
  path: "/v1/getProfile",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      return request.app.db.query(
        "SELECT pro, status FROM users WHERE user_id = ?",
        [user],
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            if (result[0].status == 1) {
              request.app.db.query(
                "SELECT link FROM contentMakers WHERE user_id = ?",
                [user],
                (err, result2) => {
                  if (err)
                    return resolve({
                      response: false,
                      message: "something wen't wrong...",
                    });
                  else {
                    result[0]["link"] = result2[0]["link"];
                    return resolve({ response: result[0] });
                  }
                }
              );
            } else {
              return resolve({ response: result[0] });
            }
          }
        }
      );
    });
  },
};
