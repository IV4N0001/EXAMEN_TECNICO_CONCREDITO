export const getCookie = (name: string): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};