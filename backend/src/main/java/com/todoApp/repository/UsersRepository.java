package com.todoApp.repository;

import com.todoApp.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users,Long> {
    Users findByUsername(String username);

    @Modifying
    @Query("update Users u set u.password = ?1, u.email = ?2 , u.phoneNum=?3 where u.id = ?4")
    void updateUserInfoById(String password, String email, String phoneNum,Long userId);

}
