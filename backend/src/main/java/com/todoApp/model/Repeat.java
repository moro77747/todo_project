package com.todoApp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.todoApp.utils.Frequency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Repeat")
@Schema(name = "Repeat", description = "Represents the repeat configuration for a task")
public class Repeat {

    @Id
    @GeneratedValue
    @Schema(description = "Unique identifier for the repeat configuration", example = "1")
    private Long repeatId;

    @Schema(description = "Identifier of the associated task", example = "101")
    private Long taskId;

    @Schema(description = "Frequency of the repeat (e.g., DAILY, WEEKLY, MONTHLY)", example = "DAILY")
    private Frequency.frequency repeateFrequency;

    @Schema(description = "Number of days for the frequency interval", example = "7")
    private Integer intervals;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Schema(description = "Start date of the repeat configuration", example = "2025-05-01")
    private LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Schema(description = "End date of the repeat configuration", example = "2025-05-31")
    private LocalDate endDate;
}