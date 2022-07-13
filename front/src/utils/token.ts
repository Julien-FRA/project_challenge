export const getToken = () => {
  const url = window.location.search;
  const identityTokenParam = new URLSearchParams(url);
  const identityToken = identityTokenParam.get("token");
  return identityToken;
};