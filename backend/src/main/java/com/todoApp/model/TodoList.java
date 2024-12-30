package com.todoApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TodoList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String listName;

    private String userName;

    @OneToMany(mappedBy = "todoList",cascade = {CascadeType.REMOVE,CascadeType.REFRESH,CascadeType.MERGE},orphanRemoval = true)
    private List<Todo> list;

}
