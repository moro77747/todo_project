package com.todoApp.service;

import com.todoApp.model.Users;
import com.todoApp.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserRegisterService {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public void register(Users user) throws Exception {
        if(usersRepository.findByUsername(user.getUsername())!=null)
        {
            throw new Exception("User exists");
        }
        else
        {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            usersRepository.save(user);
        }
    }
}
