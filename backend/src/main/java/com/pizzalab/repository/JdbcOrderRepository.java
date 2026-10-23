package com.pizzalab.repository;
import com.pizzalab.model.*; import org.springframework.jdbc.core.*; import org.springframework.jdbc.support.GeneratedKeyHolder; import org.springframework.stereotype.Repository; import java.sql.*; import java.time.*; import java.util.*;
/** DAO JDBC que reconstruye el agregado sin filtrar reglas de negocio hacia SQL. */
@Repository public class JdbcOrderRepository implements OrderRepository {
 private final JdbcTemplate jdbc; public JdbcOrderRepository(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public long insert(OrderStatus status,int total,Instant created){ GeneratedKeyHolder keys=new GeneratedKeyHolder(); jdbc.update(c->{PreparedStatement p=c.prepareStatement("INSERT INTO orders(status,total_cents,created_at) VALUES(?,?,?)",Statement.RETURN_GENERATED_KEYS);p.setString(1,status.name());p.setInt(2,total);p.setString(3,created.toString());return p;},keys); return Objects.requireNonNull(keys.getKey()).longValue(); }
 public void insertLine(long id,OrderLine line){jdbc.update("INSERT INTO order_lines(order_id,pizza_id,pizza_name,unit_price_cents,quantity) VALUES(?,?,?,?,?)",id,line.pizzaId(),line.pizzaName(),line.unitPriceCents(),line.quantity());}
 public List<Order> findAll(){return jdbc.query("SELECT id,status,total_cents,created_at FROM orders ORDER BY id DESC",(rs,n)->build(rs));}
 public Optional<Order> findById(long id){return jdbc.query("SELECT id,status,total_cents,created_at FROM orders WHERE id=?",(rs,n)->build(rs),id).stream().findFirst();}
 public void updateStatus(long id,OrderStatus status){jdbc.update("UPDATE orders SET status=? WHERE id=?",status.name(),id);}
 /** Convierte el instante a la zona de operación para que el reporte local no cambie de día cerca de medianoche UTC. */
 public List<Order> findForDate(LocalDate date){return findAll().stream().filter(order->order.createdAt().atZone(ZoneId.of("America/Mexico_City")).toLocalDate().equals(date)).toList();}
 private Order build(ResultSet rs)throws SQLException {long id=rs.getLong("id"); List<OrderLine> lines=jdbc.query("SELECT pizza_id,pizza_name,unit_price_cents,quantity FROM order_lines WHERE order_id=?",(l,n)->new OrderLine(l.getLong(1),l.getString(2),l.getInt(3),l.getInt(4)),id);return new Order(id,OrderStatus.valueOf(rs.getString("status")),rs.getInt("total_cents"),Instant.parse(rs.getString("created_at")),lines);}
}
