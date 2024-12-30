package com.todoApp.repository;

import com.todoApp.model.Repeat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepeatRepository extends JpaRepository<Repeat,Long> {
}
