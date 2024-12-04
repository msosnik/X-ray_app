package com.backend.user;

public enum Role {
    GENERAL_USER,
    PATIENT,
    DOCTOR;

    
    public static Role fromString(String role) {
        for (Role r : Role.values()) {
            if (r.name().equalsIgnoreCase(role)) {
                return r;
            }
        }
        throw new IllegalArgumentException("No enum constant for role: " + role);
    }
}
