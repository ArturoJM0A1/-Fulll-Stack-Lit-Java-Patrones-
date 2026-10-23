package com.pizzalab.batch;
import com.pizzalab.dto.SalesReportResponse; import com.pizzalab.model.Order; import com.pizzalab.repository.ReportRepository; import org.springframework.batch.core.*; import org.springframework.batch.item.Chunk; import org.springframework.batch.item.ItemWriter; import org.springframework.beans.factory.annotation.Value; import org.springframework.batch.core.configuration.annotation.JobScope; import org.springframework.stereotype.Component; import java.time.*; import java.util.*;
/** Writer por JobScope: acumula chunks aislados y solo persiste el reporte cuando el Job termina correctamente. */
@Component @JobScope public class ReportCollector implements ItemWriter<Order>, JobExecutionListener {
 private final ReportRepository reports; private final LocalDate date; private int count; private int cents; private final Map<String,Integer> statuses=new TreeMap<>();
 public ReportCollector(ReportRepository reports,@Value("#{jobParameters['date']}") String date){this.reports=reports;this.date=LocalDate.parse(date);}
 @Override public void write(Chunk<? extends Order> chunk){for(Order order:chunk){count++; cents=Math.addExact(cents,order.totalCents());statuses.merge(order.status().name(),1,Integer::sum);}}
 @Override public void afterJob(JobExecution execution){if(execution.getStatus()==BatchStatus.COMPLETED) reports.upsert(new SalesReportResponse(date,count,cents,Map.copyOf(statuses),Instant.now().toString()));}
}
