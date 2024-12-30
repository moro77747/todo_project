package com.todoApp.controller.todo;

import com.todoApp.model.Todo;
import com.todoApp.model.TodoList;
import com.todoApp.repository.TodoListRepository;
import com.todoApp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class TodoController {
    @Autowired
    private TodoListRepository todoListRepository;
    @Autowired
    private TodoRepository todoRepository;
    @GetMapping("/api/{todoListName}")
    @ResponseBody
    public List<Todo> getTasksByTaskListName(@PathVariable String todoListName)
    {
        List<Todo> todos = new ArrayList<>(todoListRepository.findByListName(todoListName).getList());
        return todos;
    }


    @PostMapping("/api/{todoListName}")
    public ResponseEntity<String> createToList(@PathVariable String todoListName)
    {
        TodoList todoList = new TodoList();
        todoList.setListName(todoListName);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = authentication.getName();
        todoList.setUserName(username);
        todoListRepository.save(todoList);
        return ResponseEntity.status(HttpStatus.CREATED).body("todoList created successfully");
    }
    @PostMapping("/api/{todoListName}/todo")
    public ResponseEntity<String> createTodo(@RequestBody Todo todo,@PathVariable String todoListName) {
        try {
            // Save the new todo
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            //UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = authentication.getName();
            todo.setUsername(username);
            TodoList todoList = todoListRepository.findByListName(todoListName);
            todo.setTodoList(todoList);
            todoList.getList().add(todo);
            todoListRepository.save(todoList);
            todoRepository.save(todo);
            // Return a response with status 201 CREATED and a success message
            return ResponseEntity.status(HttpStatus.CREATED).body("Task created successfully");
        } catch (Exception e) {
            // If an error occurs during creation, return a response with status 500 INTERNAL SERVER ERROR
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create task: " + e.getMessage());
        }
    }


    @GetMapping("api/todos/{id}")
    public ResponseEntity<Todo> getTaskById(@PathVariable Long id)
    {
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isPresent()) {
            Todo todo = optionalTodo.get();
            return ResponseEntity.ok(todo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("api/search/{content}")
    public ResponseEntity<List<Todo>> searchByContent(@PathVariable String content)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = authentication.getName();
        List<Todo> todoList = todoRepository.findByDescriptionOrTitleContainingIgnoreCaseAndUsername(content,content,username);
        // Check if any tasks were found
        if (!todoList.isEmpty()) {
            // Return the tasks with a 200 OK status
            return ResponseEntity.ok(todoList);
        } else {
            // Return a 404 Not Found status if no tasks were found
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/api/todos")
    public ResponseEntity<List<Todo>> searchTodos(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) Boolean repeatable,
            @RequestParam(required = false) Date targetDate) {
        List<Todo> todoList = todoRepository.searchTodos(title, done, repeatable, targetDate);
        return ResponseEntity.ok(todoList);
  }
    @PutMapping("api/todos/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        Optional<Todo> optionalTodo = todoRepository.findById(id);
        if (optionalTodo.isPresent()) {
            Todo todo = optionalTodo.get();
            // Update the existing todo with the values from the updatedTodo
            todo.setDone(updatedTodo.getDone()==null?todo.getDone():updatedTodo.getDone());
            todo.setDescription(updatedTodo.getDescription()==null?todo.getDescription(): updatedTodo.getDescription());
            todo.setRepeatable(updatedTodo.getRepeatable()==null?todo.getRepeatable():updatedTodo.getRepeatable());
            todo.setTargetDate(updatedTodo.getTargetDate()==null?todo.getTargetDate():updatedTodo.getTargetDate());
            todo.setTitle(updatedTodo.getTitle()==null?todo.getTitle(): updatedTodo.getTitle());
            // Save the updated todo
            Todo savedTodo = todoRepository.save(todo);
            return ResponseEntity.ok(savedTodo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("api/tasks/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable long id) {
        try {
            todoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
