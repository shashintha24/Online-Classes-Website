package com.skproduct.ElectroPhysics.api.dto;

import com.skproduct.ElectroPhysics.auth.Role;

public record AuthResponse(Long userId, String username, String email, Role role, String basicToken) {
}
