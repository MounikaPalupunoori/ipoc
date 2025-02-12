export const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  return true;
};
export const getLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key))
};

export const hasLocalStorage = (key) => {
  if (key in localStorage) {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return [];
  }
}