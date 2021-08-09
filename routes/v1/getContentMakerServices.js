module.exports = {
  method: "POST",
  path: "/v1/getContentMakerServices",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      return request.app.db.query(
        "SELECT * FROM contentMakers WHERE link = ?",
        [request.payload.tag.trim()],
        (err, MainResult) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            let arr = [];
            if (MainResult[0].youtube !== null) {
              request.app.db.query(
                "SELECT * FROM connectedServices WHERE service_id = 2 AND user_id = ? AND data = ?",
                [user, MainResult[0].youtube],
                (err, result) => {
                  if (err)
                    return resolve({
                      response: false,
                      message: "something wen't wrong...",
                    });
                  else {
                    if (result.length === 0) {
                      request.app.db.query(
                        "SELECT * FROM services WHERE id = 2",
                        (err, result2) => {
                          if (err)
                            return resolve({
                              response: false,
                              message: "something wen't wrong...",
                            });
                          else {
                            result2[0].channel = MainResult[0].youtube;
                            delete result2[0].public;
                            delete result2[0].description;
                            arr.push(result2[0]);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
            if (MainResult[0].twitch !== null) {
              request.app.db.query(
                "SELECT * FROM connectedServices WHERE service_id = 1 AND user_id = ? AND data = ?",
                [user, MainResult[0].twitch],
                (err, result) => {
                  if (err)
                    return resolve({
                      response: false,
                      message: "something wen't wrong...",
                    });
                  else {
                    if (result.length === 0) {
                      request.app.db.query(
                        "SELECT * FROM services WHERE id = 1",
                        (err, result2) => {
                          if (err)
                            return resolve({
                              response: false,
                              message: "something wen't wrong...",
                            });
                          else {
                            result2[0].channel = MainResult[0].twitch;
                            result2[0].title = MainResult[0].twitch;
                            delete result2[0].public;
                            delete result2[0].description;
                            arr.push(result2[0]);
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
            if (MainResult[0].tiktok !== null) {
              request.app.db.query(
                "SELECT * FROM connectedServices WHERE service_id = 3 AND user_id = ? AND data = ?",
                [user, MainResult[0].tiktok],
                (err, result) => {
                  if (err)
                    return resolve({
                      response: false,
                      message: "something wen't wrong...",
                    });
                  else {
                    if (result.length === 0) {
                      request.app.db.query(
                        "SELECT * FROM services WHERE id = 3",
                        (err, result2) => {
                          if (err)
                            return resolve({
                              response: false,
                              message: "something wen't wrong...",
                            });
                          else {
                            result2[0].channel = MainResult[0].tiktok;
                            result2[0].title = MainResult[0].tiktok;
                            delete result2[0].public;
                            delete result2[0].description;
                            arr.push(result2[0]);
                            return resolve({ response: arr });
                          }
                        }
                      );
                    }
                  }
                }
              );
            }
          }
        }
      );
    });
  },
};
