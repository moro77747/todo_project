package com.todoApp.jwt;

import com.todoApp.model.Users;
import com.todoApp.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        org.springframework.security.core.userdetails.User springUser=null;

        Users user = usersRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        String roles = user.getRoles();
        Set<GrantedAuthority> ga = new HashSet<>();

        ga.add(new SimpleGrantedAuthority(roles));


        springUser = new org.springframework.security.core.userdetails.User(
                username,
                user.getPassword(),
                ga );
        return springUser;
    }
}
