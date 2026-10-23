package com.pizzalab.service;
import com.pizzalab.dto.SalesReportResponse; import org.springframework.stereotype.Component;
/** Implementación que usa StringBuilder porque construye texto incrementalmente; String es inmutable. */
@Component public class TextReportFormatter extends ReportFormatter { @Override public String format(SalesReportResponse r){StringBuilder b=new StringBuilder("Ventas ").append(r.date()).append(": ").append(r.orderCount()).append(" pedidos, ").append(r.totalCents()).append(" centavos");r.byStatus().forEach((k,v)->b.append("; ").append(k).append('=').append(v));return b.toString();} }
