package com.todoApp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.todoApp.utils.Frequency;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repeat {
    @Id
    @GeneratedValue()
    private Long repeatId;

    private Long taskId;

    private Frequency.frequency repeateFrequency;

    public Frequency.frequency getRepeateFrequency() {
        return repeateFrequency;
    }


    private Integer intervals; //number of days for the frequency

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate endDate;





}
