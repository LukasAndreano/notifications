module.exports = {
  method: "POST",
  path: "/v1/getRating",
  handler: (request) => {
    return new Promise((resolve) => {
      let arr = [];
      let arr2 = [];
      let arr3 = [];
      request.app.db.query(
        "SELECT connectedServices.id, connectedServices.description, connectedServices.data, COUNT(data) AS count, img FROM connectedServices INNER JOIN services ON connectedServices.service_id = services.id WHERE service_id = 1 GROUP BY `data` ORDER BY count DESC LIMIT 100",
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            arr.push(result);
          }
        }
      );
      request.app.db.query(
        "SELECT connectedServices.id, connectedServices.description, connectedServices.data, COUNT(data) AS count, img FROM connectedServices INNER JOIN services ON connectedServices.service_id = services.id WHERE service_id = 2 GROUP BY `data` ORDER BY count DESC LIMIT 100",
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            arr2.push(result);
          }
        }
      );
      request.app.db.query(
        "SELECT connectedServices.id, connectedServices.description, connectedServices.data, COUNT(data) AS count, img FROM connectedServices INNER JOIN services ON connectedServices.service_id = services.id WHERE service_id = 3 GROUP BY `data` ORDER BY count DESC LIMIT 100",
        (err, result) => {
          if (err)
            return resolve({
              response: false,
              message: "something wen't wrong...",
            });
          else {
            arr3.push(result);
            return resolve({
              response: {
                twitch: arr[0],
                youtube: arr2[0],
                tiktok: arr3[0],
              },
            });
          }
        }
      );
    });
  },
};
