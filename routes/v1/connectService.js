const fetch = require("fetch").fetchUrl;
const config = require("../../config");
const parseString = require("xml2js").parseString;
const TikTokScraper = require("tiktok-scraper");

module.exports = {
  method: "POST",
  path: "/v1/connectService",
  handler: (request) => {
    let user = request.query.vk_user_id;
    return new Promise((resolve) => {
      switch (request.payload.id) {
        case '1':
          fetch(
            "https://api.twitch.tv/helix/users?login=" + request.payload.channel,
            {
              method: "GET",
              cache: "no-cache",
              headers: {
                "Client-ID": config.TWITCH_CLIENT_ID,
                "Content-Type": "application/json",
                Authorization: "Bearer " + config.TWITCH_BEARER,
              },
            },
            function (error, meta, body) {
              let result = JSON.parse(body.toString());
              if (result.data.length !== 0) {
                return request.app.db.query(
                  "SELECT * FROM connectedServices WHERE user_id = ? AND service_id = 1 AND data = ?",
                  [user, result.data[0].id],
                  (err, result2) => {
                    if (err)
                      return resolve({
                        response: false,
                        message: "something wen't wrong...",
                      });
                    else {
                      if (result2.length === 0) {
                        request.app.db.query(
                          "INSERT INTO `connectedServices`(`user_id`, `service_id`, `description`, `data`) VALUES (?, 1, ?, ?)",
                          [
                            user,
                            result.data[0].display_name,
                            result.data[0].id,
                          ],
                          (err, result2) => {
                            if (err)
                              return resolve({
                                response: false,
                                message: "something wen't wrong...",
                              });
                            else {
                              request.app.db.query(
                                "SELECT * FROM twitch_data WHERE data = ?",
                                [result.data[0].id],
                                (err, result3) => {
                                  if (result3.length === 0) {
                                    request.app.db.query(
                                      "INSERT INTO `twitch_data`(`data`) VALUES (?)",
                                      [result.data[0].id],
                                      (err, result3) => {
                                        if (err)
                                          return resolve({
                                            response: false,
                                            message: "something wen't wrong...",
                                          });
                                        else resolve({ response: true });
                                      }
                                    );
                                  } else {
                                    return resolve({ response: true });
                                  }
                                }
                              );
                            }
                          }
                        );
                      } else {
                        return resolve({
                          response: false,
                          message: "already_enabled",
                        });
                      }
                    }
                  }
                );
              } else {
                return resolve({ response: false, message: "not_found" });
              }
            }
          );
          break;

        case '2':
          if (request.payload.channel === null) {
            return resolve({
              response: false,
              message: "channel cannot be empty",
            });
          } else {
            let splittedChannel = request.payload.channel.split("channel/");
            let type;
            if (request.payload.useTag !== undefined && request.body.useTag) {
              type = "channel_id";
              splittedChannel = ["", request.payload.channel];
            } else {
              if (splittedChannel.length === 1) {
                splittedChannel = request.payload.channel.split("user/");
                if (splittedChannel.length === 1) {
                  splittedChannel = request.payload.channel.split("c/");
                }
                type = "user";
              } else if (splittedChannel.length === 2) {
                type = "channel_id";
              }
            }
            if (splittedChannel[1] === undefined) {
              return resolve({ response: false, message: "not_found" });
            } else {
              fetch(
                "https://www.youtube.com/feeds/videos.xml?" +
                  type +
                  "=" +
                  splittedChannel[1],
                function (error, meta, body) {
                  parseString(body.toString(), function (err, result) {
                    if (result === undefined) {
                      return resolve({ response: false, message: "not_found" });
                    } else {
                      let id = result.feed.id[0].split("yt:channel:")[1];
                      request.app.db.query(
                        "SELECT * FROM connectedServices WHERE user_id = ? AND service_id = 2 AND data = ?",
                        [user, id],
                        (err, result2) => {
                          if (err)
                            return resolve({
                              response: false,
                              message: "something wen't wrong...",
                            });
                          else {
                            if (result2.length === 0) {
                              request.app.db.query(
                                "INSERT INTO `connectedServices`(`user_id`, `service_id`, `description`, `data`) VALUES (?, 2, ?, ?)",
                                [user, result.feed.title[0], id],
                                (err, result3) => {
                                  if (err)
                                    return resolve({
                                      response: false,
                                      message: "something wen't wrong...",
                                    });
                                  else {
                                    request.app.db.query(
                                      "SELECT * FROM youtube_data WHERE channel_id = ?",
                                      [id],
                                      (err, result4) => {
                                        if (err)
                                          return resolve({
                                            response: false,
                                            message: "something wen't wrong...",
                                          });
                                        else {
                                          if (result4.length === 0) {
                                            request.app.db.query(
                                              "INSERT INTO `youtube_data`(`channel_id`, `video1`, `video2`, `video3`, `video4`, `video5`) VALUES (?, ?, ?, ?, ?, ?)",
                                              [
                                                id,
                                                result.feed.entry[0].id[0].slice(
                                                  9
                                                ),
                                                result.feed.entry[1].id[0].slice(
                                                  9
                                                ),
                                                result.feed.entry[2].id[0].slice(
                                                  9
                                                ),
                                                result.feed.entry[3].id[0].slice(
                                                  9
                                                ),
                                                result.feed.entry[4].id[0].slice(
                                                  9
                                                ),
                                              ],
                                              (err, result2) => {
                                                if (err)
                                                  return resolve({
                                                    response: false,
                                                    message:
                                                      "something wen't wrong...",
                                                  });
                                                else {
                                                  return resolve({
                                                    response: true,
                                                    channel:
                                                      result.feed.title[0],
                                                  });
                                                }
                                              }
                                            );
                                          } else {
                                            return resolve({
                                              response: true,
                                              channel: result.feed.title[0],
                                            });
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
                                message: "already_enabled",
                              });
                            }
                          }
                        }
                      );
                    }
                  });
                }
              );
            }
          }
          break;

        case '3':
          if (request.payload.channel.trim() === null) {
            return resolve({
              response: false,
              message: "channel cannot be empty",
            });
          } else {
            TikTokScraper.user(request.payload.channel.trim(), {
              number: 5,
              headers: {
                "user-agent": Math.random().toString(36).substring(7),
                referer: "https://www.tiktok.com/",
              },
            }).then((data) => {
              let arr = [];
              if (data.collector.length !== 0) {
                data.collector.forEach((el) => {
                  arr.push(el.id);
                });
                if (arr.length === 0) {
                  return resolve({ response: false, message: "empty" });
                } else {
                  request.app.db.query(
                    "SELECT * FROM connectedServices WHERE user_id = ? AND service_id = 3 AND data = ?",
                    [user, request.payload.channel.trim().toLowerCase()],
                    (err, result) => {
                      if (err)
                        return resolve({
                          response: false,
                          message: "something wen't wrong...",
                        });
                      else {
                        if (result.length === 0) {
                          request.app.db.query(
                            "INSERT INTO `connectedServices`(`user_id`, `service_id`, `description`, `data`) VALUES (?, 3, ?, ?)",
                            [
                              user,
                              request.payload.channel.trim().toLowerCase(),
                              request.payload.channel.trim().toLowerCase(),
                            ],
                            (err, result) => {
                              if (err)
                                return resolve({
                                  response: false,
                                  message: "something wen't wrong...",
                                });
                              else {
                                request.app.db.query(
                                  "SELECT * FROM tiktok_data WHERE login = ?",
                                  [
                                    request.payload.channel
                                      .trim()
                                      .toLowerCase(),
                                  ],
                                  (err, result) => {
                                    if (err)
                                      return resolve({
                                        response: false,
                                        message: "something wen't wrong...",
                                      });
                                    else {
                                      if (result.length === 0) {
                                        request.app.db.query(
                                          "INSERT INTO `tiktok_data`(`login`, `video1`, `video2`, `video3`, `video4`, `video5`) VALUES (?, ?, ?, ?, ?, ?)",
                                          [
                                            request.payload.channel
                                              .trim()
                                              .toLowerCase(),
                                            arr[0],
                                            arr[1],
                                            arr[2],
                                            arr[3],
                                            arr[4],
                                          ],
                                          (err, result) => {
                                            if (err)
                                              return resolve({
                                                response: false,
                                                message:
                                                  "something wen't wrong...",
                                              });
                                            else {
                                              return resolve({
                                                response: true,
                                              });
                                            }
                                          }
                                        );
                                      } else {
                                        return resolve({ response: true });
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
                            message: "already_enabled",
                          });
                        }
                      }
                    }
                  );
                }
              } else {
                return resolve({ response: false, message: "not_found" });
              }
            });
          }
          break;

        default:
          return resolve({ response: false, message: "service not_found" });
      }
    });
  },
};
