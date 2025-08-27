package com.todoApp.repository;

import com.todoApp.model.Todo;
import com.todoApp.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoListRepository extends JpaRepository<TodoList,Long> {
    List<TodoList> findByListName(String listName);
    List<TodoList> findByUserName(String username);
}
