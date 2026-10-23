package com.pizzalab.service;
import com.pizzalab.dto.SalesReportResponse;
/** Abstracción para formatos de salida de reporte. */
public abstract class ReportFormatter { public abstract String format(SalesReportResponse report); }
