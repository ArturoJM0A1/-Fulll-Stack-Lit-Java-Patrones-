package com.pizzalab.service;
import org.slf4j.Logger; import org.slf4j.LoggerFactory; import org.springframework.stereotype.Component;
/** Consumidor concreto de eventos para auditoría sin contaminar el servicio principal. */
@Component public class OrderAuditListener implements OrderEventListener { private static final Logger LOG=LoggerFactory.getLogger(OrderAuditListener.class); public void onOrderChanged(OrderEvent event){LOG.info("Pedido {} ahora está {}",event.orderId(),event.status());} }
