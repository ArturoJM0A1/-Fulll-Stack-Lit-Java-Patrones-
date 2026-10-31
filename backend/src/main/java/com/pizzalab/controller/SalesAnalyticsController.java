package com.pizzalab.controller;

import com.pizzalab.dto.SalesAnalyticsResponse;
import com.pizzalab.service.SalesAnalyticsService;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint de solo lectura para los gráficos y los indicadores de ventas. */
@RestController
@RequestMapping("/api/analytics")
public class SalesAnalyticsController {
  private final SalesAnalyticsService analytics;

  public SalesAnalyticsController(SalesAnalyticsService analytics) {
    this.analytics = analytics;
  }

  @GetMapping("/sales")
  public SalesAnalyticsResponse sales(@RequestParam LocalDate from, @RequestParam LocalDate to) {
    return analytics.summarize(from, to);
  }
}
