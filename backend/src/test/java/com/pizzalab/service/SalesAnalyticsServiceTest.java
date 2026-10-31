package com.pizzalab.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.pizzalab.dto.SalesAnalyticsResponse;
import com.pizzalab.model.Order;
import com.pizzalab.model.OrderLine;
import com.pizzalab.model.OrderStatus;
import com.pizzalab.repository.OrderRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.junit.jupiter.api.Test;

class SalesAnalyticsServiceTest {
  @Test
  void calculaTotalesProductoDescuentoYCompletaDiasSinVentas() {
    OrderRepository orders = mock(OrderRepository.class);
    LocalDate date = LocalDate.of(2026, 10, 1);
    var instant = date.atStartOfDay(ZoneId.of("America/Mexico_City")).toInstant();
    Order order = new Order(1, OrderStatus.RECIBIDO, 800, instant,
        List.of(new OrderLine(1, "Margarita", 500, 2)));
    when(orders.findAll()).thenReturn(List.of(order));

    SalesAnalyticsResponse result = new SalesAnalyticsService(orders).summarize(date, date.plusDays(1));

    assertEquals(800, result.totalRevenueCents());
    assertEquals(1, result.orderCount());
    assertEquals(800, result.averageOrderCents());
    assertEquals("Margarita", result.bestSellingProduct());
    assertEquals(200, result.totalDiscountCents());
    assertEquals(2, result.daily().size());
    assertEquals(200, result.daily().get(0).discountsCents());
    assertEquals(0, result.daily().get(1).revenueCents());
    assertEquals(2, result.products().get(0).quantity());
    assertEquals(1, result.statuses().get("RECIBIDO"));
  }

  @Test
  void rechazaIntervaloInvertido() {
    OrderRepository orders = mock(OrderRepository.class);
    SalesAnalyticsService service = new SalesAnalyticsService(orders);
    assertThrows(IllegalArgumentException.class,
        () -> service.summarize(LocalDate.of(2026, 10, 2), LocalDate.of(2026, 10, 1)));
  }
}
