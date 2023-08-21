import { EOL } from 'os';

export const getLoggerMessage = (
  { path, query, body, method, status },
  stack = '',
): string => {
  const currentTime = new Date();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0');
  const day = currentTime.getDate().toString().padStart(2, '0');
  const year = currentTime.getFullYear();

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  const formattedDate = `${month}/${day}/${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  let message = `Url: ${path},${EOL}Query params: ${JSON.stringify(
    query,
  )},${EOL}Body: ${JSON.stringify(
    body,
  )},${EOL}Status code: ${status},${EOL}Method: ${method},${EOL}Time: ${formattedDate} ${formattedTime}${EOL}`;

  if (stack) {
    message += `Stack: ${stack}${EOL}`;
  }

  return message + EOL;
};
