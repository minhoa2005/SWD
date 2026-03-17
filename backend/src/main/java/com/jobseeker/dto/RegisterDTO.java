package com.jobseeker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterDTO {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be 3-50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9+\\-\\s()]{7,20}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$",
             message = "Password must contain at least one uppercase letter and one digit")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(SEEKER|RECRUITER)$", message = "Role must be SEEKER or RECRUITER")
    private String role;

    // Optional recruiter fields
    private String fullName;
    private String companyName;
    private String positionTitle;
}
