module.exports = {
  method: "POST",
  path: "/v1/loadFeed",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      return request.app.db.query(
        "SELECT events.message, events.description, events.link, events.time, img FROM events INNER JOIN services ON events.service_id = services.id WHERE user_ids LIKE '%" +
          user +
          "%' ORDER BY events.id DESC LIMIT 100",
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            return resolve({ response: result });
          }
        }
      );
    });
  },
};
