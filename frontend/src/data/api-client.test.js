import { describe, expect, it, vi } from 'vitest';
import { ApiClient } from './api-client.js';
/** Prueba unitaria del manejo de errores HTTP centralizado, sin depender del backend. */
describe('ApiClient',()=>{it('propaga el mensaje JSON de una respuesta no exitosa',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response(JSON.stringify({error:'Cantidad inválida'}),{status:400})));await expect(new ApiClient().pizzas()).rejects.toThrow('Cantidad inválida');});});
