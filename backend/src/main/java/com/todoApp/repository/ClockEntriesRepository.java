package com.todoApp.repository;

import com.todoApp.model.ClockEntries;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClockEntriesRepository extends JpaRepository<ClockEntries,Long> {

}
