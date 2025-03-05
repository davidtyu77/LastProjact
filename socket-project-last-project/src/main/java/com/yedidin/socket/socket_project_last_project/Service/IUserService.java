package com.yedidin.socket.socket_project_last_project.Service;

import com.yedidin.socket.socket_project_last_project.Entity.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    User createUser(User user);
    User updateUser(User user);
    void deleteUser(Long id);
    Optional<User> getUsersByRole(Long roleId);
    Optional<User> getUserByEmail(String email);
    
}
