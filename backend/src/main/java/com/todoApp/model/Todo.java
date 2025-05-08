package com.todoApp.model;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name="Todo")
@Schema(name = "Todo", description = "Represents a task with details such as title, description, target date, and status")
public class Todo implements Serializable {

    private static final long serialVersionUID = -6849794470754667710L;

    @Id
    @GeneratedValue
    @Schema(description = "Unique identifier for the task", example = "1")
    private Long id;

    @Schema(description = "Username of the task owner", example = "john_doe")
    private String username;

    @Schema(description = "Title of the task", example = "Complete project documentation")
    private String title;

    @Schema(description = "Description of the task", example = "Write detailed documentation for the project")
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    @Schema(description = "Target date for completing the task", example = "27/04/2025")
    private LocalDate targetDate;

    @Schema(description = "Status of the task (true if completed, false otherwise)", example = "false")
    private Boolean done;

    @Schema(description = "Indicates if the task is repeatable", example = "true")
    @Column(nullable = true)
    private Boolean repeatable;

    @Schema(description = "Identifier for the repeat configuration if the task is repeatable", example = "2")
    private Long repeatId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id", nullable = false)
    @JsonIgnore
    @Schema(description = "The to-do list to which this task belongs")
    private TodoList todoList;

    @OneToMany(mappedBy = "todo", cascade = CascadeType.ALL)
    @Schema(description = "List of clock entries associated with this task")
    private List<ClockEntries> clockEntriesList;

    @Schema(description = "Duration required to complete the task", example = "PT2H30M")
    private Duration duration; // how long the task is to be done
}