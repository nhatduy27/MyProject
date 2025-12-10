import { createContext, useContext } from 'react';

const NavigationContext = createContext(null);

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider = ({ children, navigate }) => {
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};