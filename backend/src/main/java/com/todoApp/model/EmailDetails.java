package com.todoApp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailDetails {
    private String messageBody;

    private String username;

    private String title;

    public EmailDetails(EmailDetailsBuilder emailDetailsBuilder) {
        this.messageBody = emailDetailsBuilder.messageBody;
        this.title = emailDetailsBuilder.title;
        this.username = emailDetailsBuilder.username;
    }

    public static class EmailDetailsBuilder
    {
        private String messageBody;

        private String username;

        private String title;

        public EmailDetailsBuilder setMessageBody(String messageBody)
        {
            this.messageBody = messageBody;
            return this;
        }

        public EmailDetailsBuilder setUsername(String username)
        {
            this.username = username;
            return this;
        }

        public EmailDetailsBuilder setTitle(String title)
        {
            this.title = title;
            return this;
        }

        public EmailDetails build()
        {
            return new EmailDetails(this);
        }


    }

}
