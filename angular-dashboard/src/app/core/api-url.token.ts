import { InjectionToken } from '@angular/core';

/** URL raíz inyectable para mantener la configuración fuera de los servicios REST. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
