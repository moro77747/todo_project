package com.todoApp.controller.todo;

import com.todoApp.model.ClockEntries;
import com.todoApp.model.Todo;
import com.todoApp.model.TodoList;
import com.todoApp.repository.ClockEntriesRepository;
import com.todoApp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@RestController
public class TimeClockController {
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private ClockEntriesRepository clockEntriesRepository;
    @PostMapping("/api/timeclock/clock-in")
    public ClockEntries clockIn(@RequestParam Long todoId) {

        Todo todo = todoRepository.findById(todoId).get();
        LocalDateTime ldt = LocalDateTime.ofInstant(Instant.now(), ZoneOffset.ofHours(1));
        //Timestamp current = Timestamp.valueOf(ldt);
        ClockEntries clockEntry = new ClockEntries();
        clockEntry.setTodo(todo);
        clockEntry.setStartTime(ldt);
        clockEntriesRepository.save(clockEntry);
        return clockEntry;
    }

    @PostMapping("/api/timeclock/clock-out")
    public ClockEntries clockOut(@RequestParam Long clockEntryId) {
        ClockEntries clockEntry = clockEntriesRepository.findById(clockEntryId).get();
        LocalDateTime ldt = LocalDateTime.ofInstant(Instant.now(), ZoneOffset.ofHours(1));
        //Timestamp current = Timestamp.valueOf(ldt);
        clockEntry.setEndTime(ldt);
        Duration duration = Duration.between(clockEntry.getStartTime(), clockEntry.getEndTime());
        clockEntry.setDuration(duration);
        Todo todo = clockEntry.getTodo();
        todo.setDuration(todo.getDuration()==null?duration:todo.getDuration().plus(duration));
        todoRepository.save(todo);
        clockEntriesRepository.save(clockEntry);
        return clockEntry;
    }
}
