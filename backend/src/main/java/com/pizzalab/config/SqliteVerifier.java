package com.pizzalab.config;
import javax.sql.DataSource; import org.springframework.boot.ApplicationRunner; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import java.sql.*;
/** Demuestra try-with-resources: la conexión, sentencia y resultado JDBC se cierran incluso ante un error. */
@Configuration public class SqliteVerifier { @Bean ApplicationRunner verifySqlite(DataSource source){return args->{try(Connection connection=source.getConnection();Statement statement=connection.createStatement();ResultSet result=statement.executeQuery("SELECT 1")){if(!result.next())throw new IllegalStateException("SQLite no respondió");}catch(SQLException error){throw new IllegalStateException("No se pudo verificar SQLite",error);}};} }
