package com.pizzalab.service;
/** Observer real: desacopla a quien publica cambios de quien los registra. */
public interface OrderEventListener { void onOrderChanged(OrderEvent event); }
