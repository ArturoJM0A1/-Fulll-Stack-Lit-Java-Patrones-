package com.pizzalab.dto;
import jakarta.validation.Valid; import jakarta.validation.constraints.NotEmpty; import java.util.List;
/** Entrada sin precios: el servidor es la única fuente de verdad monetaria. */
public record CreateOrderRequest(@NotEmpty List<@Valid OrderItemRequest> items) { }
