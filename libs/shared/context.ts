/* eslint-disable import/prefer-default-export */
export const contextResponse = (status: number, headers: boolean, body: any) => ({
  status,
  headers: headers ? { 'Content-Type': 'application/json' } : {},
  body,
});
