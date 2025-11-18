import Cookies from "js-cookie";

export const ACCESS_TOKEN_COOKIE = "at";
export const REFRESH_TOKEN_COOKIE = "rt";

export const storeAuthTokens = (
  accessToken: string,
  refreshToken?: string,
  refreshTokenExpiresAt?: string
) => {
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken);
  if (refreshToken) {
    const options: Cookies.CookieAttributes = {};
    if (refreshTokenExpiresAt) {
      options.expires = new Date(refreshTokenExpiresAt);
    }
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, options);
  }
};

export const clearAuthTokens = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_COOKIE);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_COOKIE);
