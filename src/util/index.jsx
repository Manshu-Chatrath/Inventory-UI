export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const invalidToken = (code) => {
  if (code === 401) {
    localStorage.clear();
    window.location.reload();
  }
};
