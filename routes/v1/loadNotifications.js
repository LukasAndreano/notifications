module.exports = {
  method: "POST",
  path: "/v1/loadNotifications",
  handler: (request) => {
    return new Promise((resolve) => {
      let user = request.query.vk_user_id;
      return request.app.db.query(
        "SELECT * FROM users WHERE user_id = ?",
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
                "INSERT INTO `users`(`user_id`) VALUES (?)",
                [user],
                (err, result) => {
                  if (err)
                    return resolve({
                      response: false,
                      message: "something wen't wrong...",
                    });
                }
              );
            }
            request.app.db.query(
              "SELECT connectedServices.id, connectedServices.service_id, connectedServices.description, connectedServices.data, name, img FROM `connectedServices` INNER JOIN services ON connectedServices.service_id = services.id WHERE user_id = ? ORDER BY connectedServices.id DESC",
              [user],
              (err, result) => {
                if (err)
                  return resolve({
                    response: false,
                    message: "something wen't wrong...",
                  });
                else {
                  request.app.db.query(
                    "SELECT group_notifications, notifications FROM users WHERE user_id = ?",
                    [user],
                    (err, result2) => {
                      if (err)
                        return resolve({
                          response: false,
                          message: "something wen't wrong...",
                        });
                      else {
                        return resolve({
                          response: {
                            notifications: result,
                            user: result2[0],
                          },
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  },
};
