package com.skproduct.ElectroPhysics.api;

import com.skproduct.ElectroPhysics.api.dto.UserDto;
import com.skproduct.ElectroPhysics.auth.User;
import com.skproduct.ElectroPhysics.security.CurrentUserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MeController {

    private final CurrentUserService currentUserService;

    public MeController(CurrentUserService currentUserService) {
        this.currentUserService = currentUserService;
    }

    @GetMapping("/me")
    public UserDto me(Authentication authentication) {
        User user = currentUserService.requireCurrentUser(authentication);
        return new UserDto(user.getId(), user.getUsername(), user.getRole());
    }
}

