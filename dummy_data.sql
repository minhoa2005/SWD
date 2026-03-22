-- Use the database specified in properties
USE jobseeker_db;

-- 1. Insert Users
INSERT INTO users (user_id, username, email, password_hash, role, status, phone, account_status, failed_login_attempts, created_at) VALUES 
('u1-admin-001', 'admin', 'admin@jobseeker.com', '$2a$10$xyz', 'ADMIN', 'ACTIVE', '0123456780', 'ACTIVE', 0, NOW()),
('u2-recruiter-001', 'recruiter1', 'recruiter1@company.com', '$2a$10$xyz', 'RECRUITER', 'ACTIVE', '0123456781', 'ACTIVE', 0, NOW()),
('u3-recruiter-002', 'recruiter2', 'recruiter2@enterprise.com', '$2a$10$xyz', 'RECRUITER', 'ACTIVE', '0123456782', 'ACTIVE', 0, NOW()),
('u4-seeker-001', 'seeker1', 'seeker1@gmail.com', '$2a$10$xyz', 'SEEKER', 'ACTIVE', '0123456783', 'ACTIVE', 0, NOW()),
('u5-seeker-002', 'seeker2', 'seeker2@gmail.com', '$2a$10$xyz', 'SEEKER', 'ACTIVE', '0123456784', 'ACTIVE', 0, NOW()),
('u6-seeker-003', 'seeker3', 'seeker3@gmail.com', '$2a$10$xyz', 'SEEKER', 'ACTIVE', '0123456785', 'ACTIVE', 0, NOW());

-- 2. Insert Recruiter Profiles
INSERT INTO recruiter_profiles (recruiter_profile_id, user_id, company_id, position_title, department, contact_phone, bio, is_primary_contact) VALUES
('rp1-001', 'u2-recruiter-001', 'comp-001', 'HR Manager', 'Human Resources', '0123456781', 'Experienced HR professional.', TRUE),
('rp2-002', 'u3-recruiter-002', 'comp-002', 'Technical Recruiter', 'Talent Acquisition', '0123456782', 'Looking for top tech talent.', TRUE);

-- 3. Insert Seeker Profiles
INSERT INTO seeker_profiles (seeker_profile_id, user_id, full_name, phone_number, date_of_birth, current_location, headline, education, skills, job_preferences, profile_completeness, is_open_to_work, experience) VALUES
('sp1-001', 'u4-seeker-001', 'John Doe', '0123456783', '1995-05-15', 'New York', 'Software Engineer', 'BSc Computer Science', 'Java, Spring Boot, MySQL', 'Backend Developer roles', 80, TRUE, 3),
('sp2-002', 'u5-seeker-002', 'Jane Smith', '0123456784', '1992-10-20', 'San Francisco', 'Frontend Developer', 'MSc Software Engineering', 'React, JavaScript, CSS', 'Frontend Developer roles', 90, TRUE, 5),
('sp3-003', 'u6-seeker-003', 'Bob Johnson', '0123456785', '1998-02-10', 'Chicago', 'Data Analyst', 'BSc Statistics', 'Python, SQL, Tableau', 'Data Analyst roles', 70, TRUE, 1);

-- 4. Insert Jobs
INSERT INTO jobs (job_id, company_id, recruiter_profile_id, job_title, job_desc, required_skills, experience_required, education_required, employment_type, work_mode, salary_min, salary_max, job_location, job_status, is_active, posted_at, expires_at) VALUES
('job-001', 'comp-001', 'rp1-001', 'Senior Backend Engineer', 'Looking for an experienced Java developer.', 'Java, Spring Boot, Microservices', 4, 'BSc Computer Science', 'Full-time', 'Hybrid', 80000.00, 120000.00, 'New York', 'Active', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('job-002', 'comp-002', 'rp2-002', 'Frontend React Developer', 'Join our dynamic frontend team.', 'React, TypeScript, Tailwind', 2, 'BSc Computer Science', 'Part-time', 'Remote', 30000.00, 45000.00, 'San Francisco', 'Active', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('job-003', 'comp-001', 'rp1-001', 'Data Scientist', 'Analyze large datasets to drive business decisions.', 'Python, Machine Learning, SQL', 3, 'MSc Data Science', 'Contract', 'On-site', 90000.00, 130000.00, 'New York', 'Active', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('job-004', 'comp-002', 'rp2-002', 'UI/UX Design Intern', 'Learn and grow with our design team.', 'Figma, Adobe XD', 0, 'Currently enrolled in BSc', 'Internship', 'Hybrid', 15000.00, 25000.00, 'San Francisco', 'Active', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('job-005', 'comp-001', 'rp1-001', 'Freelance Copywriter', 'Write compelling marketing copy.', 'Copywriting, SEO', 2, 'BA English', 'Freelance', 'Remote', 40000.00, 60000.00, 'Anywhere', 'Active', TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));

-- 5. Insert Resumes
INSERT INTO resumes (resume_id, seeker_profile_id, file_name, file_format, file_size, file_url, upload_date, is_default) VALUES
('res-001', 'sp1-001', 'JohnDoe_Resume.pdf', 'pdf', 1024500, '/uploads/resumes/JohnDoe_Resume.pdf', NOW(), TRUE),
('res-002', 'sp2-002', 'JaneSmith_CV.pdf', 'pdf', 2048000, '/uploads/resumes/JaneSmith_CV.pdf', NOW(), TRUE),
('res-003', 'sp3-003', 'BobJohnson_Resume.docx', 'docx', 512000, '/uploads/resumes/BobJohnson_Resume.docx', NOW(), TRUE);

-- 6. Insert Applications
INSERT INTO applications (application_id, job_id, seeker_profile_id, cover_letter, application_status, cv_path, strategy_used, applied_at, notes) VALUES
('app-001', 'job-001', 'sp1-001', 'I am very interested in this backend role.', 'Applied', '/uploads/resumes/JohnDoe_Resume.pdf', 'Direct', NOW(), 'Strong background in Java.'),
('app-002', 'job-002', 'sp2-002', 'My frontend skills match your requirements perfectly.', 'Under Review', '/uploads/resumes/JaneSmith_CV.pdf', 'Referral', NOW(), 'Great React portfolio.'),
('app-003', 'job-003', 'sp3-003', 'I have a strong background in data analysis.', 'Applied', '/uploads/resumes/BobJohnson_Resume.docx', 'Direct', NOW(), 'Initial screening required.');
