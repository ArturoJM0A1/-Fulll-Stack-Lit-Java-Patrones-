package com.pizzalab.exception;
/** Excepción de dominio que se traduce a HTTP 404 en el controlador global. */
public class NotFoundException extends RuntimeException { public NotFoundException(String message){ super(message); } }
