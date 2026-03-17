package com.jobseeker.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeekerProfileDTO {
    private String fullName;
    private String phoneNumber;
    private String currentLocation;
    private String headline;
    private String education;
    private String skills;
    private String jobPreferences;
    private Integer experience;
    private Boolean isOpenToWork;
    private LocalDate dateOfBirth;
}
