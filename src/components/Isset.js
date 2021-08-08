export default async function isset(data) {
  if (data !== undefined && data !== null && data.length !== 0) return true;
  else return false;
}
