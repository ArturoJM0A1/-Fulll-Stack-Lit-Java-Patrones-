package com.pizzalab.repository;
import com.pizzalab.model.*; import java.time.*; import java.util.*;
/** Puerto de persistencia para el agregado Pedido. */
public interface OrderRepository { long insert(OrderStatus status,int total,Instant created); void insertLine(long orderId,OrderLine line); List<Order> findAll(); Optional<Order> findById(long id); void updateStatus(long id,OrderStatus status); List<Order> findForDate(LocalDate date); }
