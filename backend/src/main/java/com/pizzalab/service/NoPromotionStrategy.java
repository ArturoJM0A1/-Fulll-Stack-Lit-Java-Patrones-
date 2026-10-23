package com.pizzalab.service;
import com.pizzalab.model.OrderLine; import org.springframework.stereotype.Component; import java.util.List;
/** Estrategia por defecto: hace explícito que no existe descuento oculto. */
@Component public class NoPromotionStrategy implements PromotionStrategy { @Override public int apply(List<OrderLine> lines,int subtotal){return subtotal;} }
