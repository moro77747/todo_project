package com.todoApp.controller.todo;

import com.todoApp.model.Todo;
import com.todoApp.model.TodoList;
import com.todoApp.repository.TodoListRepository;
import com.todoApp.repository.TodoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@Tag(name = "TodoController", description = "APIs for managing tasks and to-do lists")
public class TodoController {

    @Autowired
    private TodoListRepository todoListRepository;

    @Autowired
    private TodoRepository todoRepository;

    @Operation(summary = "Get tasks by to-do list name", description = "Fetches all tasks associated with a specific to-do list.")
    @GetMapping("/api/{todoListName}")
    @ResponseBody
    public List<Todo> getTasksByTaskListName(
            @PathVariable @Parameter(description = "Name of the to-do list", example = "Daily Tasks") String todoListName) {
        List<Todo> todos = todoListRepository.findByListName(todoListName).getList();
        return todos;
    }

    @Operation(summary = "Create a new to-do list", description = "Creates a new to-do list with the specified name.")
    @PostMapping("/api/{todoListName}")
    public ResponseEntity<String> createToList(
            @PathVariable @Parameter(description = "Name of the to-do list to be created", example = "Daily Tasks") String todoListName) {
        TodoList todoList = new TodoList();
        todoList.setListName(todoListName);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        todoList.setUserName(username);
        todoListRepository.save(todoList);
        return ResponseEntity.status(HttpStatus.CREATED).body("To-do list created successfully");
    }

    @Operation(summary = "Create a new task", description = "Creates a new task and associates it with a specific to-do list.")
    @PostMapping("/api/{todoListName}/todo")
    public ResponseEntity<String> createTodo(
            @RequestBody @Parameter(description = "Details of the task to be created") Todo todo,
            @PathVariable @Parameter(description = "Name of the to-do list to associate the task with", example = "Daily Tasks") String todoListName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            todo.setUsername(username);
            TodoList todoList = todoListRepository.findByListName(todoListName);
            todo.setTodoList(todoList);
            todoList.getList().add(todo);
            todoListRepository.save(todoList);
            todoRepository.save(todo);
            return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create task: " + e.getMessage());
        }
    }

    @Operation(summary = "Get a task by ID", description = "Fetches a task by its unique identifier.")
    @GetMapping("api/todos/{id}")
    public ResponseEntity<Todo> getTaskById(
            @PathVariable @Parameter(description = "Unique identifier of the task", example = "1") Long id) {
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        return optionalTodo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Search tasks by content", description = "Searches for tasks by their title or description.")
    @GetMapping("api/search/{content}")
    public ResponseEntity<List<Todo>> searchByContent(
            @PathVariable @Parameter(description = "Content to search for in task titles or descriptions", example = "project") String content) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<Todo> todoList = todoRepository.findByDescriptionOrTitleContainingIgnoreCaseAndUsername(content, content, username);
        return todoList.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(todoList);
    }

    @Operation(summary = "Search tasks with filters", description = "Searches for tasks using optional filters such as title, status, repeatability, and target date.")
    @GetMapping("/api/todos")
    public ResponseEntity<List<Todo>> searchTodos(
            @RequestParam(required = false) @Parameter(description = "Title of the task to search for", example = "Documentation") String title,
            @RequestParam(required = false) @Parameter(description = "Completion status of the task", example = "true") Boolean done,
            @RequestParam(required = false) @Parameter(description = "Repeatability status of the task", example = "false") Boolean repeatable,
            @RequestParam(required = false) @Parameter(description = "Target date of the task", example = "2025-04-27") Date targetDate) {
        List<Todo> todoList = todoRepository.searchTodos(title, done, repeatable, targetDate);
        return ResponseEntity.ok(todoList);
    }

    @Operation(summary = "Update a task", description = "Updates an existing task by its unique identifier.")
    @PutMapping("api/todos/{id}")
    public ResponseEntity<Todo> updateTodo(
            @PathVariable @Parameter(description = "Unique identifier of the task to be updated", example = "1") Long id,
            @RequestBody @Parameter(description = "Updated details of the task") Todo updatedTodo) {
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isPresent()) {
            Todo todo = optionalTodo.get();
            todo.setDone(updatedTodo.getDone() == null ? todo.getDone() : updatedTodo.getDone());
            todo.setDescription(updatedTodo.getDescription() == null ? todo.getDescription() : updatedTodo.getDescription());
            todo.setRepeatable(updatedTodo.getRepeatable() == null ? todo.getRepeatable() : updatedTodo.getRepeatable());
            todo.setTargetDate(updatedTodo.getTargetDate() == null ? todo.getTargetDate() : updatedTodo.getTargetDate());
            todo.setTitle(updatedTodo.getTitle() == null ? todo.getTitle() : updatedTodo.getTitle());
            Todo savedTodo = todoRepository.save(todo);
            return ResponseEntity.ok(savedTodo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a task", description = "Deletes a task by its unique identifier.")
    @DeleteMapping("api/tasks/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable @Parameter(description = "Unique identifier of the task to be deleted", example = "1") long id) {
        try {
            todoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}