module.exports = {
  method: "POST",
  path: "/v1/disableService",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      switch (request.payload.id) {
        case '1':
          if (request.payload.data === undefined) {
            return resolve({
              response: false,
              message: "data cannot be empty",
            });
          } else {
            return request.app.db.query(
              "SELECT * FROM connectedServices WHERE user_id = ? AND service_id = 1 AND data = ?",
              [user, request.payload.data],
              (err, result) => {
                if (err)
                  return resolve({
                    response: false,
                    message: "something wen't wrong...",
                  });
                else {
                  if (result.length !== 0) {
                    request.app.db.query(
                      "DELETE FROM connectedServices WHERE user_id = ? AND service_id = 1 AND data = ?",
                      [user, request.payload.data],
                      (err, result) => {
                        if (err)
                          return resolve({
                            response: false,
                            message: "something wen't wrong...",
                          });
                        else {
                          request.app.db.query(
                            "SELECT * FROM connectedServices WHERE data = ?",
                            [request.payload.data],
                            (err, result) => {
                              if (err)
                                return resolve({
                                  response: false,
                                  message: "something wen't wrong...",
                                });
                              else {
                                if (result.length !== 0) {
                                  return resolve({ response: true });
                                } else {
                                  request.app.db.query(
                                    "DELETE FROM twitch_data WHERE data = ?",
                                    [request.payload.data],
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
                            }
                          );
                        }
                      }
                    );
                  } else {
                    return resolve({
                      response: false,
                      message: "already_deleted",
                    });
                  }
                }
              }
            );
          }
          break;

        case '2':
          if (request.payload.data === undefined) {
            return resolve({
              response: false,
              message: "data cannot be empty",
            });
          } else {
            return request.app.db.query(
              "SELECT * FROM connectedServices WHERE user_id = ? AND service_id = 2 AND data = ?",
              [user, request.payload.data],
              (err, result) => {
                if (err)
                  return resolve({
                    response: false,
                    message: "something wen't wrong...",
                  });
                else {
                  if (result.length !== 0) {
                    request.app.db.query(
                      "DELETE FROM connectedServices WHERE user_id = ? AND service_id = 2 AND data = ?",
                      [user, request.payload.data],
                      (err, result) => {
                        if (err)
                          return resolve({
                            response: false,
                            message: "something wen't wrong...",
                          });
                        else {
                          request.app.db.query(
                            "SELECT * FROM connectedServices WHERE data = ?",
                            [request.payload.data],
                            (err, result) => {
                              if (err)
                                return resolve({
                                  response: false,
                                  message: "something wen't wrong...",
                                });
                              else {
                                if (result.length !== 0) {
                                  return resolve({ response: true });
                                } else {
                                  request.app.db.query(
                                    "DELETE FROM youtube_data WHERE channel_id = ?",
                                    [request.payload.data],
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
                            }
                          );
                        }
                      }
                    );
                  } else {
                    return resolve({
                      response: false,
                      message: "already_deleted",
                    });
                  }
                }
              }
            );
          }
          break;

        case '3':
          if (request.payload.data === undefined) {
            return resolve({
              response: false,
              message: "data cannot be empty",
            });
          } else {
            return request.app.db.query(
              "SELECT * FROM connectedServices WHERE user_id = ? AND service_id = 3 AND data = ?",
              [user, request.payload.data],
              (err, result) => {
                if (err)
                  return resolve({
                    response: false,
                    message: "something wen't wrong...",
                  });
                else {
                  if (result.length !== 0) {
                    request.app.db.query(
                      "DELETE FROM connectedServices WHERE user_id = ? AND service_id = 3 AND data = ?",
                      [user, request.payload.data],
                      (err, result) => {
                        if (err)
                          return resolve({
                            response: false,
                            message: "something wen't wrong...",
                          });
                        else {
                          request.app.db.query(
                            "SELECT * FROM connectedServices WHERE data = ?",
                            [request.payload.data],
                            (err, result) => {
                              if (err)
                                return resolve({
                                  response: false,
                                  message: "something wen't wrong...",
                                });
                              else {
                                if (result.length !== 0) {
                                  return resolve({ response: true });
                                } else {
                                  request.app.db.query(
                                    "DELETE FROM tiktok_data WHERE login = ?",
                                    [request.payload.data],
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
                            }
                          );
                        }
                      }
                    );
                  } else {
                    return resolve({
                      response: false,
                      message: "already_deleted",
                    });
                  }
                }
              }
            );
          }
          break;

        default:
          return resolve({ response: false, message: "service not found" });
      }
    });
  },
};
