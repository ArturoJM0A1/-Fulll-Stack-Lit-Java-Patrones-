package com.pizzalab.controller;
import com.pizzalab.exception.*; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import org.springframework.web.bind.MethodArgumentNotValidException; import java.util.Map;
/** Convierte errores de validación y dominio en contratos HTTP predecibles. */
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(NotFoundException.class) ResponseEntity<Map<String,String>> missing(NotFoundException e){return error(HttpStatus.NOT_FOUND,e.getMessage());}
 @ExceptionHandler(ConflictException.class) ResponseEntity<Map<String,String>> conflict(ConflictException e){return error(HttpStatus.CONFLICT,e.getMessage());}
 @ExceptionHandler({IllegalArgumentException.class,MethodArgumentNotValidException.class}) ResponseEntity<Map<String,String>> invalid(Exception e){return error(HttpStatus.BAD_REQUEST,"Solicitud inválida: "+e.getMessage());}
 private ResponseEntity<Map<String,String>> error(HttpStatus status,String message){return ResponseEntity.status(status).body(Map.of("error",message));}
}
