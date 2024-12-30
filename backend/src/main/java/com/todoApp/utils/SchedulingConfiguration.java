package com.todoApp.utils;

import com.todoApp.service.EmailNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class SchedulingConfiguration {
    @Autowired
    private EmailNotificationService emailNotificationService;

    @Scheduled(cron = "0 0 0 * * *")
    public void scheduleRunDailyTask() {
        emailNotificationService.dailyEmailNotification();
    }
}
