package com.jobseeker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfileDTO {
    private String positionTitle;
    private String department;
    private String contactPhone;
    private String bio;
    private Boolean isPrimaryContact;
}
