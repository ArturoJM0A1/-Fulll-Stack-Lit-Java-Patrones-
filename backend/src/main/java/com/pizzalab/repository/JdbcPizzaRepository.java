package com.pizzalab.repository;
import com.pizzalab.model.Pizza; import org.springframework.jdbc.core.JdbcTemplate; import org.springframework.stereotype.Repository; import java.util.List; import java.util.Optional;
/** Implementación JDBC: JdbcTemplate usa sentencias parametrizadas, no concatena entrada del usuario. */
@Repository public class JdbcPizzaRepository implements PizzaRepository {
 private final JdbcTemplate jdbc; public JdbcPizzaRepository(JdbcTemplate jdbc){this.jdbc=jdbc;}
 private final org.springframework.jdbc.core.RowMapper<Pizza> mapper=(rs,n)->new Pizza(rs.getLong("id"),rs.getString("name"),rs.getString("description"),rs.getInt("price_cents"));
 public List<Pizza> findAll(){return jdbc.query("SELECT id,name,description,price_cents FROM pizzas ORDER BY id",mapper);}
 public Optional<Pizza> findById(long id){return jdbc.query("SELECT id,name,description,price_cents FROM pizzas WHERE id=?",mapper,id).stream().findFirst();}
}
