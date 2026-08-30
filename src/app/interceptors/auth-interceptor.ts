import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Local storage se apna token nikalo
  const token = localStorage.getItem('erp_token');

  // Agar token hai, toh usko request ke header mein chipka do
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Agar token nahi hai (jaise login page pe), toh normal request jaane do
  return next(req);
};