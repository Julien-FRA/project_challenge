export const logout = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    const userStorage = localStorage.getItem("user");
    if (userStorage) return JSON.parse(userStorage);
    return 'Pas de token/Vous n\'etes pas connecté';
};