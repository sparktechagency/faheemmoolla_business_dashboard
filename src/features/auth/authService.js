export const saveToken = (token) => {
    localStorage.setItem("businessToken", token);
  };
  
  export const getToken = () => {
    return localStorage.getItem("businessToken");
  };
  
  export const removeToken = () => {
    localStorage.removeItem("businessToken");
  };
  
  export const isAuthenticated = () => {
    return !!getToken(); 
  };
  