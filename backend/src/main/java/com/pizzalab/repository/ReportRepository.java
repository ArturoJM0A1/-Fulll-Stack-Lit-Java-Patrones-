package com.pizzalab.repository;
import com.pizzalab.dto.SalesReportResponse; import java.time.LocalDate; import java.util.Optional;
/** Persistencia separada del producto del procesamiento batch. */
public interface ReportRepository { void upsert(SalesReportResponse report); Optional<SalesReportResponse> find(LocalDate date); }
