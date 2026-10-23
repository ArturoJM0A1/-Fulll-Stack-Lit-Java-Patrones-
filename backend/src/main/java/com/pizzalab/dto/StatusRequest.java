package com.pizzalab.dto;
import com.pizzalab.model.OrderStatus; import jakarta.validation.constraints.NotNull;
/** Cambio explícito de estado protegido por reglas de transición. */
public record StatusRequest(@NotNull OrderStatus status) { }
