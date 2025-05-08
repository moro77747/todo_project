package com.todoApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ClockEntries")
@Schema(name = "ClockEntries", description = "Represents a clock entry for tracking task time, including start time, end time, and duration")
public class ClockEntries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique identifier for the clock entry", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "todo_id")
    @JsonIgnore
    @Schema(description = "The task associated with this clock entry")
    private Todo todo;

    @Schema(description = "Start time of the clock entry", example = "2025-04-27T09:00:00")
    private LocalDateTime startTime;

    @Schema(description = "End time of the clock entry", example = "2025-04-27T11:30:00")
    private LocalDateTime endTime;

    @Schema(description = "Duration of the clock entry", example = "PT2H30M")
    private Duration duration;
}