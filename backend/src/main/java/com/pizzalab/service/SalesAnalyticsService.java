package com.pizzalab.service;

import com.pizzalab.dto.SalesAnalyticsResponse;
import com.pizzalab.model.Order;
import com.pizzalab.model.OrderLine;
import com.pizzalab.repository.OrderRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Service;

/** Calcula las métricas administrativas usando pedidos y líneas persistidos. */
@Service
public class SalesAnalyticsService {
  private static final ZoneId BUSINESS_ZONE = ZoneId.of("America/Mexico_City");
  private final OrderRepository orders;

  public SalesAnalyticsService(OrderRepository orders) {
    this.orders = orders;
  }

  public SalesAnalyticsResponse summarize(LocalDate from, LocalDate to) {
    if (from.isAfter(to)) {
      throw new IllegalArgumentException("La fecha inicial debe ser anterior o igual a la fecha final");
    }

    List<Order> selected = orders.findAll().stream()
        .filter(order -> {
          LocalDate date = order.createdAt().atZone(BUSINESS_ZONE).toLocalDate();
          return !date.isBefore(from) && !date.isAfter(to);
        })
        .toList();

    Map<LocalDate, int[]> dailyTotals = new TreeMap<>();
    Map<String, int[]> productTotals = new TreeMap<>();
    Map<String, Integer> statuses = new TreeMap<>();
    int revenue = 0;
    int discounts = 0;

    for (Order order : selected) {
      LocalDate date = order.createdAt().atZone(BUSINESS_ZONE).toLocalDate();
      int subtotal = order.lines().stream().mapToInt(OrderLine::lineTotalCents).sum();
      int discount = Math.max(0, subtotal - order.totalCents());
      revenue = Math.addExact(revenue, order.totalCents());
      discounts = Math.addExact(discounts, discount);

      int[] day = dailyTotals.computeIfAbsent(date, ignored -> new int[3]);
      day[0] = Math.addExact(day[0], order.totalCents());
      day[1] = Math.addExact(day[1], discount);
      day[2]++;
      statuses.merge(order.status().name(), 1, Math::addExact);

      for (OrderLine line : order.lines()) {
        int[] product = productTotals.computeIfAbsent(line.pizzaName(), ignored -> new int[2]);
        product[0] = Math.addExact(product[0], line.quantity());
        product[1] = Math.addExact(product[1], line.lineTotalCents());
      }
    }

    List<SalesAnalyticsResponse.DailySales> daily = new ArrayList<>();
    for (LocalDate day = from; !day.isAfter(to); day = day.plusDays(1)) {
      int[] totals = dailyTotals.getOrDefault(day, new int[3]);
      daily.add(new SalesAnalyticsResponse.DailySales(day, totals[0], totals[1], totals[2]));
    }

    List<SalesAnalyticsResponse.ProductSales> products = productTotals.entrySet().stream()
        .map(entry -> new SalesAnalyticsResponse.ProductSales(
            entry.getKey(), entry.getValue()[0], entry.getValue()[1]))
        .sorted(Comparator.comparingInt(SalesAnalyticsResponse.ProductSales::quantity).reversed()
            .thenComparing(SalesAnalyticsResponse.ProductSales::name))
        .toList();
    String bestSeller = products.isEmpty() ? null : products.get(0).name();
    int count = selected.size();
    return new SalesAnalyticsResponse(
        from, to, revenue, count, count == 0 ? 0 : revenue / count, bestSeller, discounts,
        daily, products, new LinkedHashMap<>(statuses));
  }
}
