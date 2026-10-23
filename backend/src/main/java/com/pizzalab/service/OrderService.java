package com.pizzalab.service;
import com.pizzalab.dto.*; import com.pizzalab.exception.*; import com.pizzalab.model.*; import com.pizzalab.repository.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional; import java.time.Instant; import java.util.*;
/** Facade de pedidos: coordina validación, precios, DAO y eventos dentro de una transacción atómica. */
@Service public class OrderService {
 private final OrderRepository orders; private final PizzaRepository pizzas; private final PromotionStrategy promotion; private final List<OrderEventListener> observers;
 public OrderService(OrderRepository o,PizzaRepository p,PromotionStrategy s,List<OrderEventListener> listeners){orders=o;pizzas=p;promotion=s;observers=listeners;}
 public List<OrderResponse> list(){return orders.findAll().stream().map(this::dto).toList();}
 public OrderResponse get(long id){return dto(require(id));}
 @Transactional public OrderResponse create(CreateOrderRequest input){
   // Map conserva una sola línea por pizza para evitar inconsistencias de cantidades repetidas.
   Map<Long,Integer> requested=new LinkedHashMap<>(); for(OrderItemRequest i:input.items()) requested.merge(i.pizzaId(),i.quantity(),Math::addExact);
   List<OrderLine> lines=new ArrayList<>(); Set<Long> distinctPizzaIds=new LinkedHashSet<>(requested.keySet()); for(long pizzaId:distinctPizzaIds){Pizza p=pizzas.findById(pizzaId).orElseThrow(()->new NotFoundException("Pizza inexistente: "+pizzaId)); lines.add(new OrderLine(p,requested.get(pizzaId)));}
   int subtotal=lines.stream().mapToInt(OrderLine::lineTotalCents).sum(); int total=promotion.apply(lines,subtotal); long id=orders.insert(OrderStatus.RECIBIDO,total,Instant.now()); lines.forEach(line->orders.insertLine(id,line)); notifyObservers(id,OrderStatus.RECIBIDO); return get(id);
 }
 @Transactional public OrderResponse changeStatus(long id,OrderStatus next){Order current=require(id); if(next.ordinal()!=current.status().ordinal()+1) throw new ConflictException("Transición no permitida de "+current.status()+" a "+next); orders.updateStatus(id,next); notifyObservers(id,next); return get(id);}
 private Order require(long id){return orders.findById(id).orElseThrow(()->new NotFoundException("Pedido inexistente: "+id));}
 private void notifyObservers(long id,OrderStatus status){OrderEvent event=new OrderEvent(id,status); observers.forEach(listener->listener.onOrderChanged(event));}
 private OrderResponse dto(Order o){return new OrderResponse(o.id(),o.status(),o.totalCents(),o.createdAt(),o.lines().stream().map(l->new OrderLineResponse(l.pizzaId(),l.pizzaName(),l.unitPriceCents(),l.quantity(),l.lineTotalCents())).toList());}
}
