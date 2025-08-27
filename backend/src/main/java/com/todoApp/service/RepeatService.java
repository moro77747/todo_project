package com.todoApp.service;

import com.todoApp.model.Repeat;
import com.todoApp.model.Todo;
import com.todoApp.model.TodoList;
import com.todoApp.repository.RepeatRepository;
import com.todoApp.repository.TodoListRepository;
import com.todoApp.repository.TodoRepository;
import com.todoApp.utils.Frequency;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class RepeatService {

    @Autowired
    private RepeatRepository repeatRepository;
    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private TodoListRepository todoListRepository;
    @Transactional
    public List<Todo> createRepeat(Repeat repeat) {



        // Generate tasks based on the repeat
        List<Todo> generatedTodos = generateTodosFromRepeat(repeat);
        if(generatedTodos!=null)
        {
            // Save repeat to the database

            // Save generated Todos to the database
            todoRepository.saveAll(generatedTodos);
        }


        return generatedTodos;
    }

    private List<Todo> generateTodosFromRepeat(Repeat repeat) {
        List<Todo> generatedTodos = new ArrayList<>();
        repeat = repeatRepository.save(repeat);
        LocalDate currentDate = repeat.getStartDate();
        LocalDate endDate =  repeat.getEndDate();
        if(currentDate==null || endDate ==null) return null;
        Todo origTodo = todoRepository.findById(repeat.getTaskId()).get();
        TodoList todoList = origTodo.getTodoList();
        while (currentDate.isBefore(endDate) || currentDate.isEqual(endDate)) {
            Todo todo = new Todo();
            // Populate task properties based on repeat and current date
            todo.setRepeatId(repeat.getRepeatId()); // Associate the task with its repeat
            // Set other task properties
            todo.setUsername(origTodo.getUsername());
            todo.setDone(false);
            todo.setDescription(origTodo.getDescription());
            todo.setTitle(origTodo.getTitle());
            todo.setTodoList(todoList);
            todo.setTargetDate(currentDate);
            todoList.getList().add(todo);
            generatedTodos.add(todo);
            if(repeat.getRepeateFrequency()== null)  currentDate = currentDate.plusDays(repeat.getIntervals());
            else {
                switch (repeat.getRepeateFrequency()) {
                    case daily:
                        currentDate = currentDate.plusDays(1);
                        break;
                    case weekly:
                        currentDate = currentDate.plusWeeks(1);
                        break;
                    case yearly:
                        currentDate = currentDate.plusYears(1);
                        break;
                    case monthly:
                        currentDate = currentDate.plusMonths(1);
                        break;
                    default:
                        currentDate = currentDate.plusDays(repeat.getIntervals());
                        // Add cases for other frequencies as needed
                }
            }
            // Move to the next interval based on the repeat frequency

        }

        origTodo.setRepeatId(repeat.getRepeatId());
        origTodo.setRepeatable(true);
        todoRepository.save(origTodo);

        todoListRepository.save(todoList);
        return generatedTodos;
    }

    public Repeat getRepeatById(Long repeatId) {
        return repeatRepository.findById(repeatId).orElse(null);
    }

    public boolean deleteRepeat(Long repeatId) throws Exception {
        Repeat repeat = repeatRepository.findById(repeatId).
                orElseThrow(() -> new Exception("Repeat not found with id: " + repeatId));
        if (repeat != null) {
            repeatRepository.delete(repeat);
            List<Todo> todoList = todoRepository.findByRepeatId(repeatId);

            List<Todo> updatedTodoList = new ArrayList<>();

            for (Todo todo : todoList) {
                Boolean flag = todo.getRepeatable() == null ? false : todo.getRepeatable();
                if (!flag) {
                    updatedTodoList.add(todo); // Add the current todo to the updated list if it should not be removed
                }
            }

            // Replace the original todoList with the updatedTodoList
            todoList.clear();
            todoList.addAll(updatedTodoList);

            todoRepository.deleteAll(todoList);
            return true;
        } else {
            return false;
        }
    }

    public Repeat updateRepeat(Long repeatId, Repeat updatedRepeat) throws Exception {
        Repeat existingRepeat = repeatRepository.findById(repeatId)
                .orElseThrow(() -> new Exception("Repeat not found with id: " + repeatId));
        // Update the existing repeat with the new values
        existingRepeat.setRepeateFrequency(updatedRepeat.getRepeateFrequency());
        existingRepeat.setStartDate(updatedRepeat.getStartDate());
        existingRepeat.setEndDate(updatedRepeat.getEndDate());
        existingRepeat.setIntervals(updatedRepeat.getIntervals());
        // Save the updated repeat
        Repeat savedRepeat = repeatRepository.save(existingRepeat);

        List<Todo> todoList = todoRepository.findByRepeatId(repeatId);

        List<Todo> updatedTodoList = new ArrayList<>();

        for (Todo todo : todoList) {
            Boolean flag = todo.getRepeatable() == null ? false : todo.getRepeatable();
            if (!flag) {
                updatedTodoList.add(todo); // Add the current todo to the updated list if it should not be removed
            }
        }

        // Replace the original todoList with the updatedTodoList
        todoList.clear();
        todoList.addAll(updatedTodoList);

        todoRepository.deleteAll(todoList);

        // Update the associated tasks based on the new repeat schedule
        // Generate tasks based on the repeat
        List<Todo> generatedTodos = generateTodosFromRepeat(savedRepeat);
        // Save generated Todos to the database
        todoRepository.saveAll(generatedTodos);

        return savedRepeat;
    }


}
