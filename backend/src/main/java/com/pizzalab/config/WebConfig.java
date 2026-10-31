package com.pizzalab.config;
import org.springframework.context.annotation.Configuration; import org.springframework.web.servlet.config.annotation.*;
/** CORS restringido a los orígenes de desarrollo Lit y Angular; no se abre a cualquier sitio. */
@Configuration public class WebConfig implements WebMvcConfigurer { @Override public void addCorsMappings(CorsRegistry r){r.addMapping("/api/**").allowedOrigins("http://localhost:5173","http://127.0.0.1:5173","http://localhost:4200","http://127.0.0.1:4200").allowedMethods("GET","POST","PATCH");} }
