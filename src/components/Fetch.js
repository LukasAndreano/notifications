export default async function fetch2(method, params = null) {
  const data = await fetch(
    "https://notifications.lukass.ru/v1/" +
      method +
      "?" +
      window.location.href.slice(window.location.href.indexOf("?") + 1),
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    }
  )
    .then((data) => data.json())
    .then((res) => {
      return res;
    });
  return data;
}
