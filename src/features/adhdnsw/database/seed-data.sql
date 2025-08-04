-- Seed data for ADHDNSW.org

-- Service Types
INSERT INTO service_types (slug, name, description, category, display_order) VALUES
('psychiatrist', 'Psychiatrist', 'Medical doctors specializing in ADHD diagnosis and medication', 'medical', 1),
('psychologist', 'Psychologist', 'Therapy and behavioral interventions for ADHD', 'therapy', 2),
('paediatrician', 'Paediatrician', 'Children''s doctors with ADHD expertise', 'medical', 3),
('gp-adhd', 'GP (ADHD Trained)', 'General practitioners with ADHD management training', 'medical', 4),
('adhd-coach', 'ADHD Coach', 'Practical strategies and life skills coaching', 'coaching', 5),
('occupational-therapist', 'Occupational Therapist', 'Daily living skills and sensory support', 'therapy', 6),
('educational-psychologist', 'Educational Psychologist', 'Learning assessments and school support', 'assessment', 7);

-- Age Groups
INSERT INTO age_groups (slug, name, min_age, max_age) VALUES
('children', 'Children (6-12)', 6, 12),
('adolescents', 'Adolescents (13-17)', 13, 17),
('young-adults', 'Young Adults (18-25)', 18, 25),
('adults', 'Adults (26+)', 26, 99);

-- Payment Methods
INSERT INTO payment_methods (slug, name, description) VALUES
('medicare', 'Medicare', 'Bulk billing or Medicare rebates available'),
('private-health', 'Private Health Insurance', 'Accepts most private health funds'),
('ndis', 'NDIS', 'Registered NDIS provider'),
('out-of-pocket', 'Private/Out of Pocket', 'Private fees apply'),
('mental-health-plan', 'Mental Health Care Plan', 'Accepts GP Mental Health Care Plans');

-- Blog Categories
INSERT INTO blog_categories (slug, name, description, display_order) VALUES
('diagnosis-guides', 'Diagnosis Guides', 'Everything about getting an ADHD diagnosis in NSW', 1),
('treatment-options', 'Treatment Options', 'Medication, therapy, and other treatments', 2),
('living-with-adhd', 'Living with ADHD', 'Daily strategies and life management', 3),
('education-support', 'Education & School', 'Support for students and educators', 4),
('workplace', 'Workplace & Career', 'ADHD in professional settings', 5),
('family-relationships', 'Family & Relationships', 'Supporting loved ones with ADHD', 6),
('nsw-news', 'NSW News & Updates', 'Local news, policy changes, and events', 7),
('research-insights', 'Research & Insights', 'Latest ADHD research and findings', 8);

-- Sample Professionals (for development)
INSERT INTO professionals (
    slug, title, first_name, last_name, credentials, 
    email, phone, is_verified, bio, specializations,
    ndis_registered, meta_description
) VALUES 
(
    'dr-sarah-chen', 'Dr', 'Sarah', 'Chen', 
    ARRAY['MBBS', 'FRANZCP'], 
    'reception@drchenpsych.com.au', '02 9XXX XXXX',
    true,
    'Dr Sarah Chen is a consultant psychiatrist with over 15 years experience in ADHD diagnosis and treatment. She has a special interest in adult ADHD and women with ADHD.',
    ARRAY['Adult ADHD', 'Women with ADHD', 'Anxiety and ADHD'],
    false,
    'Dr Sarah Chen - Experienced ADHD psychiatrist in Sydney CBD. Specializing in adult ADHD diagnosis and treatment. Book online or call for appointments.'
),
(
    'james-thompson-psych', 'Mr', 'James', 'Thompson',
    ARRAY['B.Psych(Hons)', 'M.ClinPsych'],
    'admin@thompsonpsychology.com.au', '02 9XXX XXXX',
    true,
    'Clinical psychologist specializing in ADHD across the lifespan. Uses evidence-based approaches including CBT and mindfulness.',
    ARRAY['ADHD Therapy', 'CBT for ADHD', 'Mindfulness'],
    true,
    'James Thompson - Clinical psychologist offering ADHD therapy in Parramatta. NDIS registered. Specializes in CBT and mindfulness for ADHD management.'
);

-- Sample Locations
INSERT INTO locations (
    professional_id, name, street_address, suburb, postcode,
    latitude, longitude, is_primary, offers_telehealth
)
SELECT 
    p.id, 'Sydney CBD Practice', '123 Macquarie Street', 'Sydney', '2000',
    -33.8688, 151.2093, true, true
FROM professionals p WHERE p.slug = 'dr-sarah-chen';

INSERT INTO locations (
    professional_id, name, street_address, suburb, postcode,
    latitude, longitude, is_primary, offers_telehealth
)
SELECT 
    p.id, 'Parramatta Clinic', '456 Church Street', 'Parramatta', '2150',
    -33.8151, 151.0011, true, true
FROM professionals p WHERE p.slug = 'james-thompson-psych';

-- Sample Blog Posts
INSERT INTO blog_posts (
    slug, title, excerpt, content, author_name,
    status, published_at, is_featured, meta_description
) VALUES
(
    'complete-guide-adhd-diagnosis-nsw',
    'Complete Guide to ADHD Diagnosis in NSW (2024)',
    'Everything you need to know about getting an ADHD diagnosis in New South Wales, including costs, wait times, and what to expect.',
    '# Complete Guide to ADHD Diagnosis in NSW

Getting an ADHD diagnosis in NSW can feel overwhelming, but understanding the process makes it much easier...

## Who Can Diagnose ADHD in NSW?

In New South Wales, ADHD can be diagnosed by:
- Psychiatrists
- Paediatricians (for children)
- Some clinical psychologists (assessment only)

## The Diagnosis Process

1. **GP Referral**: Start with your GP for a referral
2. **Initial Assessment**: First appointment with specialist
3. **Comprehensive Evaluation**: May include psychological testing
4. **Diagnosis and Treatment Plan**: Discussion of results and next steps

## Costs and Medicare

- Psychiatrist consultations: $400-600 (Medicare rebate ~$230)
- Psychological assessment: $1500-2500
- Some bulk-billing options available

## Wait Times in NSW

Current average wait times:
- Public system: 6-12 months
- Private psychiatrists: 2-4 months
- Telehealth options: 2-6 weeks',
    'ADHD NSW Editorial Team',
    'published',
    NOW(),
    true,
    'Complete guide to getting an ADHD diagnosis in NSW. Learn about the process, costs, wait times, and finding the right specialist in 2024.'
);

-- Link blog posts to categories
INSERT INTO blog_post_categories (post_id, category_id)
SELECT p.id, c.id
FROM blog_posts p, blog_categories c
WHERE p.slug = 'complete-guide-adhd-diagnosis-nsw' 
AND c.slug = 'diagnosis-guides';

-- Professional service associations
INSERT INTO professional_services (professional_id, service_type_id)
SELECT p.id, s.id
FROM professionals p, service_types s
WHERE p.slug = 'dr-sarah-chen' AND s.slug = 'psychiatrist';

INSERT INTO professional_services (professional_id, service_type_id)
SELECT p.id, s.id
FROM professionals p, service_types s
WHERE p.slug = 'james-thompson-psych' AND s.slug = 'psychologist';