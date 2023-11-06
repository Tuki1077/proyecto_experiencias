import { createContext, useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from '../Hooks/useLocaleStorage';
import { useLocalStorageCart } from '../Hooks/useLocaleStorageCart';

import jwt_decode from 'jwt-decode';
import { getAxios } from '../axiosCalls';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage('token');
  const [tokenContent, setTokenContent] = useLocalStorage('tokenContent');
  const [userInfo, setUserInfo] = useState(null);

  const [cartExperience, setCartExperience] = useLocalStorageCart('infoCart');

  const logout = useCallback(() => {
    setToken(null);
    setTokenContent(null);
    setUserInfo(null);
    setCartExperience([]);
  }, [setToken, setTokenContent, setCartExperience]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const decoded = jwt_decode(token);
        setTokenContent(decoded);
        const { data } = await getAxios(
          `http://3.87.209.149:8080/users/${decoded.idUser}`,
          token
        );
        setUserInfo({
          ...data,
          avatar: data.avatar
            ? `http://3.87.209.149:8080/uploads/${data.avatar}`
            : null,
        });
      } catch (error) {
        logout();
      }
    };
    if (token) getUserInfo();
  }, [token, setUserInfo, setTokenContent, logout]);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        token,
        setToken,
        logout,
        tokenContent,
        setCartExperience,
        cartExperience,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
