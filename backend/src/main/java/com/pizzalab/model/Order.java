package com.pizzalab.model;

import java.time.Instant;
import java.util.List;

/** Agregado de pedido con sus líneas, encapsulado como una vista inmutable del dominio. */
public record Order(long id, OrderStatus status, int totalCents, Instant createdAt, List<OrderLine> lines) { }
