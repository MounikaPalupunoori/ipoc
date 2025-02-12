export const checkTokenExpire = (token, secretKey) => {
  // const SECRET_KEY = 'iFfcNdoFXrOceBL4'; //process.env.SECRET_KEY;
  //"2021-04-13T00:00:00.000+08:00"
  const currentDate = new Date().getTime() + 10000;
  let decryptedToken = atob(token).replace(secretKey, '');
  let tokenPayload = decryptedToken.split('.').length > 1? JSON.parse(
    atob(decryptedToken.split('.')[1].replace('-', '+').replace('_', '/'))
  ): {};
  const tokenValidTill = tokenPayload?.exp? tokenPayload.exp * 1000: 0;
  let output = {
    isValid: false,
    tokenValidTill: tokenValidTill,
    token: decryptedToken,
    userName: tokenPayload?.username,
    roleId: tokenPayload?.role_id,
    userId: tokenPayload?.sub? parseInt(tokenPayload?.sub): 0,
  };
  if (tokenValidTill > currentDate) {
    output.isValid = true;
  }
  return output;
  //  localStorage.setItem('token', token);
};
