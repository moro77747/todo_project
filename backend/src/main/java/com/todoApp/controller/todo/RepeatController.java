package com.todoApp.controller.todo;

import com.todoApp.model.Repeat;
import com.todoApp.model.Todo;
import com.todoApp.service.RepeatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "RepeatController", description = "APIs for managing repeat configurations for tasks")
public class RepeatController {

    @Autowired
    private RepeatService repeatService;

    @Operation(summary = "Create a new repeat configuration", description = "Creates a new repeat configuration and returns the associated tasks.")
    @PostMapping("/api/repeats")
    public ResponseEntity<List<Todo>> createRepeat(
            @RequestBody @Parameter(description = "Details of the repeat configuration to be created") Repeat repeat) {
        List<Todo> todoList = repeatService.createRepeat(repeat);
        return ResponseEntity.status(HttpStatus.CREATED).body(todoList);
    }

    @Operation(summary = "Get a repeat configuration by ID", description = "Fetches a repeat configuration by its unique identifier.")
    @GetMapping("/api/repeats/{repeatId}")
    public ResponseEntity<Repeat> getRepeatById(
            @PathVariable @Parameter(description = "Unique identifier of the repeat configuration", example = "1") Long repeatId) {
        Repeat repeat = repeatService.getRepeatById(repeatId);
        if (repeat != null) {
            return ResponseEntity.ok(repeat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a repeat configuration", description = "Deletes a repeat configuration by its unique identifier.")
    @DeleteMapping("/api/repeats/{repeatId}")
    public ResponseEntity<Void> deleteRepeat(
            @PathVariable @Parameter(description = "Unique identifier of the repeat configuration to be deleted", example = "1") Long repeatId) throws Exception {
        if (repeatService.deleteRepeat(repeatId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Update a repeat configuration", description = "Updates an existing repeat configuration by its unique identifier.")
    @PutMapping("/api/repeats/{repeatId}")
    public ResponseEntity<Repeat> updateRepeat(
            @PathVariable @Parameter(description = "Unique identifier of the repeat configuration to be updated", example = "1") Long repeatId,
            @RequestBody @Parameter(description = "Updated details of the repeat configuration") Repeat repeat) throws Exception {
        Repeat updatedRepeat = repeatService.updateRepeat(repeatId, repeat);
        if (updatedRepeat != null) {
            return ResponseEntity.ok(updatedRepeat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}