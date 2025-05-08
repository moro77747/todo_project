package com.todoApp.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "EmailDetails")
@Schema(name = "EmailDetails", description = "Represents the details of an email, including the message body, username, and title")
public class EmailDetails {

    @Schema(description = "The body of the email message", example = "This is a reminder for your task.")
    private String messageBody;

    @Schema(description = "The username of the recipient", example = "john_doe")
    private String username;

    @Schema(description = "The title or subject of the email", example = "Task Reminder")
    private String title;

    public EmailDetails(EmailDetailsBuilder emailDetailsBuilder) {
        this.messageBody = emailDetailsBuilder.messageBody;
        this.title = emailDetailsBuilder.title;
        this.username = emailDetailsBuilder.username;
    }

    public static class EmailDetailsBuilder {

        @Schema(description = "The body of the email message", example = "This is a reminder for your task.")
        private String messageBody;

        @Schema(description = "The username of the recipient", example = "john_doe")
        private String username;

        @Schema(description = "The title or subject of the email", example = "Task Reminder")
        private String title;

        public EmailDetailsBuilder setMessageBody(String messageBody) {
            this.messageBody = messageBody;
            return this;
        }

        public EmailDetailsBuilder setUsername(String username) {
            this.username = username;
            return this;
        }

        public EmailDetailsBuilder setTitle(String title) {
            this.title = title;
            return this;
        }

        public EmailDetails build() {
            return new EmailDetails(this);
        }
    }
}