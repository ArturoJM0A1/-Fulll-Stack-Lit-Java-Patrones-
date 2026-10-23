package com.pizzalab.dto;
import jakarta.validation.constraints.Positive;
/** Validación declarativa de cada producto solicitado. */
public record OrderItemRequest(@Positive long pizzaId, @Positive int quantity) { }
