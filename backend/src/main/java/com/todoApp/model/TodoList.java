package com.todoApp.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TodoList")
@Schema(name = "TodoList", description = "Represents a to-do list with a name, associated user, and tasks")
public class TodoList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the to-do list", example = "1")
    private Long id;

    @Schema(description = "Name of the to-do list", example = "Daily Tasks")
    private String listName;

    @Schema(description = "Username of the owner of the to-do list", example = "john_doe")
    private String userName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @OneToMany(mappedBy = "todoList", cascade = {CascadeType.REMOVE, CascadeType.REFRESH, CascadeType.MERGE}, orphanRemoval = true)
    @Schema(description = "List of tasks associated with this to-do list")
    private List<Todo> list;

}
