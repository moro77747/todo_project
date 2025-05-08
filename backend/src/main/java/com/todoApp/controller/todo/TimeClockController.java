package com.todoApp.controller.todo;

import com.todoApp.model.ClockEntries;
import com.todoApp.model.Todo;
import com.todoApp.repository.ClockEntriesRepository;
import com.todoApp.repository.TodoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@RestController
@Tag(name = "TimeClockController", description = "APIs for managing time clock entries for tasks")
public class TimeClockController {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private ClockEntriesRepository clockEntriesRepository;

    @Operation(summary = "Clock in for a task", description = "Creates a clock-in entry for a task and records the start time.")
    @PostMapping("/api/timeclock/clock-in")
    public ClockEntries clockIn(
            @RequestParam @Parameter(description = "Unique identifier of the task to clock in", example = "1") Long todoId) {

        Todo todo = todoRepository.findById(todoId).get();
        LocalDateTime ldt = LocalDateTime.ofInstant(Instant.now(), ZoneOffset.ofHours(1));
        ClockEntries clockEntry = new ClockEntries();
        clockEntry.setTodo(todo);
        clockEntry.setStartTime(ldt);
        clockEntriesRepository.save(clockEntry);
        return clockEntry;
    }

    @Operation(summary = "Clock out for a task", description = "Creates a clock-out entry for a task, records the end time, and calculates the duration.")
    @PostMapping("/api/timeclock/clock-out")
    public ClockEntries clockOut(
            @RequestParam @Parameter(description = "Unique identifier of the clock entry to clock out", example = "1") Long clockEntryId) {

        ClockEntries clockEntry = clockEntriesRepository.findById(clockEntryId).get();
        LocalDateTime ldt = LocalDateTime.ofInstant(Instant.now(), ZoneOffset.ofHours(1));
        clockEntry.setEndTime(ldt);
        Duration duration = Duration.between(clockEntry.getStartTime(), clockEntry.getEndTime());
        clockEntry.setDuration(duration);

        Todo todo = clockEntry.getTodo();
        todo.setDuration(todo.getDuration() == null ? duration : todo.getDuration().plus(duration));
        todoRepository.save(todo);
        clockEntriesRepository.save(clockEntry);
        return clockEntry;
    }
}