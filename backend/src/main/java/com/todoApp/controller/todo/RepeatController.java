package com.todoApp.controller.todo;

import com.todoApp.model.Repeat;
import com.todoApp.model.Todo;
import com.todoApp.service.RepeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class RepeatController {
    @Autowired
    private RepeatService repeatService;

    @PostMapping("/api/repeats")
    public ResponseEntity<List<Todo>> createRepeat(@RequestBody Repeat repeat) {
        List<Todo> todoList = repeatService.createRepeat(repeat);
        return ResponseEntity.status(HttpStatus.CREATED).body(todoList);
    }

    @GetMapping("/api/repeats/{repeatId}")
    public ResponseEntity<Repeat> getRepeatById(@PathVariable Long repeatId) {
        Repeat repeat = repeatService.getRepeatById(repeatId);
        if (repeat != null) {
            return ResponseEntity.ok(repeat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/api/repeats/{repeatId}")
    public ResponseEntity<Void> deleteRepeat(@PathVariable Long repeatId) throws Exception {
        if (repeatService.deleteRepeat(repeatId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/api/repeats/{repeatId}")
    public ResponseEntity<Repeat> updateRepeat(
            @PathVariable Long repeatId,
            @RequestBody Repeat repeat) throws Exception {
        Repeat updatedRepeat = repeatService.updateRepeat(repeatId, repeat);
        if (updatedRepeat != null) {
            return ResponseEntity.ok(updatedRepeat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
