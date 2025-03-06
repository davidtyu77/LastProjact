package com.yedidin.socket.socket_project_last_project.Service;

import com.yedidin.socket.socket_project_last_project.Entity.User;
import com.yedidin.socket.socket_project_last_project.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        userRepository = this.userRepository;
    }

    @Override
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User createUser(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setRole(user.getRole());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        if(!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getUsersByRoleId(Long roleId) {
        return userRepository.findByRole_Id(roleId);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

}
