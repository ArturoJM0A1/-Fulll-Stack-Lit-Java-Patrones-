package com.pizzalab.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/** Agregados calculados a partir de pedidos reales para el intervalo solicitado. */
public record SalesAnalyticsResponse(
    LocalDate from,
    LocalDate to,
    int totalRevenueCents,
    int orderCount,
    int averageOrderCents,
    String bestSellingProduct,
    int totalDiscountCents,
    List<DailySales> daily,
    List<ProductSales> products,
    Map<String, Integer> statuses
) {
  public record DailySales(LocalDate date, int revenueCents, int discountsCents, int orderCount) { }
  public record ProductSales(String name, int quantity, int revenueCents) { }
}
