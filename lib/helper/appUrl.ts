export function getAppUrl(path: string) {
  // this way url base can be saved in env variable
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return `${appUrl}/${path}`;
}
