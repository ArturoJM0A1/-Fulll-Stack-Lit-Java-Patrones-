package com.pizzalab.service;
import com.pizzalab.model.OrderStatus;
/** Evento inmutable observado por el registro de auditoría de pedidos. */
public record OrderEvent(long orderId, OrderStatus status) { }
