import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/** Error HTTP tipado para que las vistas comuniquen fallos sin conocer el formato Spring. */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly originalError: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/** Normaliza errores de red y el campo `error` devuelto por ApiExceptionHandler. */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const backendMessage =
        typeof error.error === 'object' && error.error !== null && 'error' in error.error
          ? String(error.error.error)
          : '';
      const message =
        backendMessage ||
        (error.status === 0
          ? 'No se pudo conectar con Spring Boot. Comprueba que la API esté disponible.'
          : `La solicitud falló (HTTP ${error.status}).`);

      return throwError(() => new ApiRequestError(message, error.status, error));
    })
  );
