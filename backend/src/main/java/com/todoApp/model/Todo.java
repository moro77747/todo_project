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
public class Todo implements Serializable {

	private static final long serialVersionUID = -6849794470754667710L;
	@Id
	@GeneratedValue
	private Long id;

	private String username;
	private String title;


	private String description;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
	@JsonDeserialize(using = LocalDateDeserializer.class)
	@JsonSerialize(using = LocalDateSerializer.class)
	private LocalDate targetDate;
	private Boolean done;

	//If the task is repeatable the generated todo tasks cannot be repeatable
	@Column(nullable = true)
	private Boolean repeatable;
	private Long repeatId;
	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "list_id",nullable = false)
	@JsonIgnore
	private TodoList todoList;

	@OneToMany(mappedBy = "todo",cascade = CascadeType.ALL)
	private List<ClockEntries> clockEntriesList;



	private Duration duration;//how long the task  to be done

}