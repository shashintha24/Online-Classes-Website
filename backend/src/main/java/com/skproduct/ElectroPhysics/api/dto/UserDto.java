package com.skproduct.ElectroPhysics.api.dto;

import com.skproduct.ElectroPhysics.auth.Role;

public record UserDto(Long id, String username, Role role) {
}

