export const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };
  