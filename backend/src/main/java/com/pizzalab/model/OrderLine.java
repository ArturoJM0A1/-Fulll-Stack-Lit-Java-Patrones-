package com.pizzalab.model;

/** Línea inmutable que conserva nombre y precio histórico al crear el pedido. */
public record OrderLine(long pizzaId, String pizzaName, int unitPriceCents, int quantity) {
  /** Sobrecarga de constructor: evita repetir campos al convertir una Pizza del catálogo en línea histórica. */
  public OrderLine(Pizza pizza, int quantity) { this(pizza.id(), pizza.name(), pizza.priceCents(), quantity); }
  public int lineTotalCents(){ return Math.multiplyExact(unitPriceCents, quantity); }
}
