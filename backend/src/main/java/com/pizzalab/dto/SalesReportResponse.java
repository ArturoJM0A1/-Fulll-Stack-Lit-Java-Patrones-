package com.pizzalab.dto;
import java.time.LocalDate; import java.util.Map;
/** Salida de ventas que el batch persiste y la interfaz consulta. */
public record SalesReportResponse(LocalDate date, int orderCount, int totalCents, Map<String,Integer> byStatus, String generatedAt) { }
