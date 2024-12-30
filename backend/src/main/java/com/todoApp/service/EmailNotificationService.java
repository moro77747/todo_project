package com.todoApp.service;

import com.todoApp.model.EmailDetails;
import com.todoApp.model.Todo;
import com.todoApp.repository.TodoRepository;
import com.todoApp.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmailNotificationService {
    @Autowired
    private EmailService emailService;
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UsersRepository usersRepository;

    public void dailyEmailNotification()
    {
        //search due tasks and return List<Todo>
        LocalDate currentDate = LocalDate.now();
        List<Todo> todoList = todoRepository.findByTargetDate(currentDate);
        for(Todo todo: todoList)
        {
            String username = todo.getUsername();
            String email = usersRepository.findByUsername(username).getEmail();
            EmailDetails emailDetails = new EmailDetails.EmailDetailsBuilder().
                    setMessageBody(todo.getDescription())
                    .setUsername(email).
                    setTitle(todo.getTitle()).
                    build();
            emailService.sendEmail(emailDetails);
        }
    }
}
