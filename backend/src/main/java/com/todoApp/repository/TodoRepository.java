package com.todoApp.repository;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import com.todoApp.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TodoRepository extends JpaRepository<Todo, Long>{
	
	List<Todo> findByUsername(String username);

	List<Todo> findByDescriptionOrTitleContainingIgnoreCaseAndUsername(String description,String title,String username);

	List<Todo> findByTargetDate(LocalDate currentDate);

	List<Todo> findByRepeatId(Long repeatId);
	@Query(value = "SELECT t FROM Todo t WHERE (:title IS NULL OR t.title LIKE %:title%) " +
			"AND (:done IS NULL OR t.done = :done) AND" +
			" (:repeatable IS NULL OR t.repeatable = :repeatable) " +
			"AND (:targetDate IS NULL OR t.targetDate = :targetDate)"
			)
	List<Todo> searchTodos(@Param("title") String title,
						   @Param("done") Boolean done,
						   @Param("repeatable") Boolean repeatable,
						   @Param("targetDate") Date targetDate
						   );


}
