package com.pizzalab.exception;
/** Señala una transición o petición válida en forma pero no permitida en el estado actual. */
public class ConflictException extends RuntimeException { public ConflictException(String message){ super(message); } }
