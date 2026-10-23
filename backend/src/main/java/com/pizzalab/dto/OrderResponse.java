package com.pizzalab.dto;
import com.pizzalab.model.OrderStatus; import java.time.Instant; import java.util.List;
/** Representación HTTP de un pedido, separada de los modelos persistentes. */
public record OrderResponse(long id, OrderStatus status, int totalCents, Instant createdAt, List<OrderLineResponse> lines) { }
