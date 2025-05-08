package com.todoApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "phoneNum")
})
@Schema(name = "Users", description = "Represents a user with username, password, email, and phone number")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the user", example = "1")
    private Long id;

    @NotEmpty(message = "username can not be a null or empty")
    @Schema(description = "Username of the user", example = "john_doe")
    private String username;

    @NotEmpty(message = "password can not be a null or empty")
    @Schema(description = "Password of the user", example = "password123")
    private String password;

    @Schema(description = "Email address of the user", example = "john.doe@example.com")
    private String email;

    @Pattern(regexp = "(^$|[0-9]{10})", message = "Mobile Number must be 10 digits")
    @Schema(description = "Mobile number of the user", example = "4354437687")
    private String phoneNum;

    @Schema(description = "Roles assigned to the user", example = "ADMIN, USER")
    private String roles;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<TodoList> todoLists;

    // Getters, setters, and constructors
    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public Users() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Users(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    public Users(String username, String password, String email, String phoneNum) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNum = phoneNum;
    }

    public Users(String username, String password) {
        this.username = username;
        this.password = password;
    }
}