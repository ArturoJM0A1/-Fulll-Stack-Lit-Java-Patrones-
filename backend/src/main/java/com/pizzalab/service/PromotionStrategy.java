package com.pizzalab.service;
import com.pizzalab.model.OrderLine; import java.util.List;
/** Strategy intercambiable para el cálculo; hoy la promoción estándar no altera el total. */
public interface PromotionStrategy { int apply(List<OrderLine> lines, int subtotalCents); }
