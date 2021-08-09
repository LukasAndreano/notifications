module.exports = {
  method: "POST",
  path: "/v1/enableNotificationsFromApp",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      return request.app.db.query(
        "UPDATE users SET notifications = 1 WHERE user_id = ?",
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
    });
  },
};
