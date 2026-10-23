package com.pizzalab.dto;
/** Línea de salida con total calculado. */
public record OrderLineResponse(long pizzaId, String pizzaName, int unitPriceCents, int quantity, int lineTotalCents) { }
