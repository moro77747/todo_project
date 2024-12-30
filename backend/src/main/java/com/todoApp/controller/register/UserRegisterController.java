package com.todoApp.controller.register;

import com.todoApp.model.Users;
import com.todoApp.repository.UsersRepository;
import com.todoApp.service.UserRegisterService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserRegisterController {
    @Autowired
    private UserRegisterService userRegisterService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UsersRepository usersRepository;
    @PostMapping("/users")
    public String register (@RequestBody Users user)
    {
        try
        {
            userRegisterService.register(user);
            return "success";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    @PutMapping("/users/update")
    public ResponseEntity<?> update(@RequestBody Users user)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       // UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = authentication.getName();

        // Retrieve user from the database
        Users curUser = usersRepository.findByUsername(username);
        // Hash the new password
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        Long id = curUser.getId();
        usersRepository.updateUserInfoById(user.getPassword(),user.getEmail(),user.getPhoneNum(),id);
        return ResponseEntity.ok().build();
    }
}
