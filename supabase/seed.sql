-- ============================================================
-- SEED DATA: FIELDS
-- ============================================================

INSERT INTO fields (id, name_ar, name_en, type, ministerial_mandatory, ministerial_elective_pool, school_subjects, riasec_ideal, bigfive_ideal, description_ar, description_en)
VALUES
  ('health', 'الحقل الصحي', 'Health / Medical', 'scientific', '["biology", "chemistry", "advanced_english"]', '["physics", "mathematics", "earth_sciences"]', '["digital_skills", "physical_education", "other"]', '{"R": 40, "I": 90, "A": 20, "S": 70, "E": 20, "C": 40}', '{"O": 70, "C": 85, "E": 50, "A": 80, "N_inv": 75}', 'حقل يختص بالعلوم الطبية والصحية ويفتح أبواب الجامعات في تخصصات الطب والصيدلة والتمريض وغيرها.', 'Medical and health sciences field opening paths to medicine, pharmacy, nursing and more.'),
  ('engineering_tech', 'الحقل الهندسي والعلوم التكنولوجية', 'Engineering & Technology', 'scientific', '["physics", "mathematics_advanced", "advanced_english"]', '["chemistry", "biology", "computer_science"]', '["chemistry", "biology", "earth_sciences"]', '{"R": 80, "I": 85, "A": 20, "S": 20, "E": 30, "C": 50}', '{"O": 75, "C": 83, "E": 40, "A": 43, "N_inv": 75}', 'حقل يجمع بين الهندسة بتخصصاتها وعلوم الحاسوب والتكنولوجيا.', 'Engineering and technology sciences including CS, AI, and all engineering disciplines.'),
  ('law_sharia_languages', 'حقل القانون والشريعة واللغات', 'Law, Sharia & Languages', 'humanities', '["arabic_specialist", "islamic_studies_specialist", "advanced_english"]', '["history", "geography", "sociology", "psychology"]', '["history", "geography", "other_humanities"]', '{"R": 10, "I": 30, "A": 65, "S": 68, "E": 48, "C": 45}', '{"O": 65, "C": 63, "E": 68, "A": 65, "N_inv": 55}', 'حقل يجمع القانون والشريعة والعلوم الإنسانية واللغات والإعلام.', 'Humanities field covering law, sharia, languages, journalism and social sciences.'),
  ('business', 'حقل إدارة الأعمال', 'Business Administration', 'humanities', '["business_mathematics", "financial_literacy", "advanced_english"]', '["management", "digital_skills"]', '["economics", "digital_skills", "other"]', '{"R": 20, "I": 30, "A": 25, "S": 50, "E": 85, "C": 70}', '{"O": 55, "C": 80, "E": 85, "A": 50, "N_inv": 65}', 'حقل يختص بعلوم الأعمال والمحاسبة والتمويل والاقتصاد والتسويق.', 'Business field covering finance, accounting, economics, and management.');

-- ============================================================
-- SEED DATA: MAJORS
-- ============================================================

INSERT INTO majors (id, name_ar, name_en, category, min_gpa_public, min_gpa_private, competitive_gpa_range, description_ar, description_en)
VALUES
  -- ======================== Health ========================
  ('medicine', 'الطب البشري', 'Medicine', 'Health', 85, 80, '98-100', 'دراسة العلوم الطبية والجراحية لتشخيص وعلاج الأمراض.', 'Study of medical and surgical sciences to diagnose and treat diseases.'),
  ('dentistry', 'طب الأسنان', 'Dentistry', 'Health', 80, 75, '96-98', 'دراسة صحة الفم والأسنان وتقنيات العلاج والوقاية.', 'Study of oral and dental health, treatment techniques, and prevention.'),
  ('pharmacy', 'الصيدلة', 'Pharmacy', 'Health', 75, 70, '94-96', 'دراسة الأدوية وتأثيراتها وكيفية تركيبها وصرفها.', 'Study of drugs, their effects, and how they are formulated and dispensed.'),
  ('nursing', 'التمريض', 'Nursing', 'Health', 70, 65, '85-90', 'رعاية المرضى وتقديم الدعم الطبي والنفسي لهم.', 'Caring for patients and providing them with medical and psychological support.'),
  ('medical_lab', 'المختبرات الطبية', 'Medical Lab', 'Health', 70, 65, '85-90', 'إجراء التحاليل المخبرية للمساعدة في تشخيص الأمراض.', 'Performing laboratory analyses to assist in diagnosing diseases.'),
  ('physiotherapy', 'العلاج الطبيعي', 'Physiotherapy', 'Health', 70, 65, '85-90', 'استخدام التمارين والتقنيات الفيزيائية لعلاج الإصابات.', 'Using exercises and physical techniques to treat injuries.'),
  ('nutrition', 'التغذية', 'Nutrition', 'Health', 70, 65, '80-85', 'دراسة الغذاء وتأثيره على الصحة والنمو.', 'Study of food and its effect on health and growth.'),
  ('veterinary', 'الطب البيطري', 'Veterinary', 'Health', 75, 70, '80-85', 'دراسة طب الحيوان وعلاجه والوقاية من أمراضه.', 'Study of animal medicine, treatment, and prevention of diseases.'),
  ('biomedical', 'العلوم الطبية الحيوية', 'Biomedical Sciences', 'Health', 70, 65, '85-90', 'دراسة الأسس البيولوجية للطب والأمراض.', 'Study of the biological basis of medicine and diseases.'),
  -- NEW Health majors
  ('radiology', 'الأشعة والتصوير الطبي', 'Radiology & Medical Imaging', 'Health', 72, 67, '86-91', 'دراسة تقنيات التصوير الطبي مثل الأشعة السينية والرنين المغناطيسي والموجات فوق الصوتية لتشخيص الأمراض.', 'Study of medical imaging techniques such as X-ray, MRI, and ultrasound for disease diagnosis.'),
  ('occupational_therapy', 'العلاج الوظيفي', 'Occupational Therapy', 'Health', 70, 65, '82-87', 'مساعدة المرضى على استعادة قدراتهم لأداء أنشطة الحياة اليومية بعد الإصابات أو الأمراض.', 'Helping patients regain their abilities to perform daily life activities after injuries or illnesses.'),
  ('speech_therapy', 'علاج النطق واللغة', 'Speech-Language Pathology', 'Health', 70, 65, '82-87', 'تشخيص وعلاج اضطرابات النطق واللغة والبلع لدى الأطفال والبالغين.', 'Diagnosing and treating speech, language, and swallowing disorders in children and adults.'),
  ('public_health', 'الصحة العامة', 'Public Health', 'Health', 68, 63, '78-83', 'دراسة أساليب الوقاية من الأمراض وتعزيز صحة المجتمعات من خلال السياسات والبرامج الصحية.', 'Study of disease prevention methods and community health promotion through health policies and programs.'),
  ('optometry', 'البصريات', 'Optometry', 'Health', 72, 67, '84-89', 'فحص العيون وتشخيص مشاكل الإبصار ووصف العدسات والعلاجات المناسبة.', 'Examining eyes, diagnosing vision problems, and prescribing appropriate lenses and treatments.'),

  -- ======================== Engineering & Tech ========================
  ('civil_engineering', 'الهندسة المدنية', 'Civil Engineering', 'Engineering', 80, 75, '90-95', 'تصميم وإنشاء البنية التحتية من مبانٍ وجسور وطرق.', 'Designing and creating infrastructure including buildings, bridges, and roads.'),
  ('electrical_engineering', 'الهندسة الكهربائية', 'Electrical Engineering', 'Engineering', 80, 75, '90-95', 'دراسة الكهرباء والإلكترونيات وأنظمة الطاقة.', 'Study of electricity, electronics, and power systems.'),
  ('mechanical_engineering', 'الهندسة الميكانيكية', 'Mechanical Engineering', 'Engineering', 80, 75, '90-95', 'تصميم وتصنيع الآلات والأنظمة الميكانيكية.', 'Designing and manufacturing machines and mechanical systems.'),
  ('computer_engineering', 'هندسة الحاسوب', 'Computer Engineering', 'Engineering', 80, 75, '90-95', 'تصميم وتطوير أنظمة الحاسوب والأجهزة الإلكترونية.', 'Designing and developing computer systems and electronic devices.'),
  ('computer_science', 'علوم الحاسوب', 'Computer Science', 'Technology', 70, 65, '80-85', 'دراسة الخوارزميات والبرمجيات وكيفية بناء الأنظمة الذكية.', 'Study of algorithms, software, and how to build smart systems.'),
  ('artificial_intelligence', 'الذكاء الاصطناعي', 'Artificial Intelligence', 'Technology', 75, 70, '90-95', 'دراسة تطوير الأنظمة والآلات التي تحاكي الذكاء البشري.', 'Study of developing systems and machines that mimic human intelligence.'),
  ('data_science', 'علم البيانات', 'Data Science', 'Technology', 75, 70, '85-90', 'تحليل البيانات الضخمة لاستخراج معلومات مفيدة.', 'Analyzing big data to extract useful information.'),
  ('architecture', 'العمارة', 'Architecture', 'Engineering', 80, 75, '92-97', 'تصميم المباني والمنشآت بجمالية ووظيفية.', 'Designing buildings and structures with aesthetics and functionality.'),
  ('cybersecurity', 'الأمن السيبراني', 'Cybersecurity', 'Technology', 75, 70, '88-93', 'حماية الأنظمة والشبكات من الهجمات الرقمية.', 'Protecting systems and networks from digital attacks.'),
  -- NEW Engineering majors
  ('chemical_engineering', 'الهندسة الكيميائية', 'Chemical Engineering', 'Engineering', 78, 73, '88-93', 'تصميم وتشغيل العمليات الكيميائية الصناعية لتحويل المواد الخام إلى منتجات مفيدة.', 'Designing and operating industrial chemical processes to convert raw materials into useful products.'),
  ('industrial_engineering', 'الهندسة الصناعية', 'Industrial Engineering', 'Engineering', 78, 73, '87-92', 'تحسين الأنظمة والعمليات الإنتاجية لزيادة الكفاءة وتقليل التكاليف.', 'Improving production systems and processes to increase efficiency and reduce costs.'),
  ('environmental_engineering', 'هندسة البيئة', 'Environmental Engineering', 'Engineering', 75, 70, '84-89', 'تطوير حلول هندسية لمشاكل التلوث وإدارة الموارد الطبيعية وحماية البيئة.', 'Developing engineering solutions for pollution problems, natural resource management, and environmental protection.'),
  ('software_engineering', 'هندسة البرمجيات', 'Software Engineering', 'Technology', 78, 73, '88-93', 'تطبيق المبادئ الهندسية على تصميم وتطوير واختبار وصيانة البرمجيات.', 'Applying engineering principles to the design, development, testing, and maintenance of software.'),
  ('network_engineering', 'هندسة الشبكات', 'Network Engineering', 'Technology', 73, 68, '83-88', 'تصميم وبناء وإدارة شبكات الاتصالات والحاسوب.', 'Designing, building, and managing computer and telecommunications networks.'),

  -- ======================== Law, Sharia & Languages ========================
  ('law', 'القانون', 'Law', 'Humanities', 70, 65, '85-90', 'دراسة القواعد القانونية والأنظمة والتشريعات.', 'Study of legal rules, systems, and legislation.'),
  ('sharia', 'الشريعة', 'Sharia', 'Humanities', 65, 60, '75-80', 'دراسة العلوم الإسلامية والفقه والأحكام.', 'Study of Islamic sciences, jurisprudence, and rulings.'),
  ('arabic_literature', 'اللغة العربية وآدابها', 'Arabic Literature', 'Humanities', 65, 60, '75-80', 'دراسة اللغة العربية وقواعدها وأدبها وتاريخها.', 'Study of the Arabic language, its grammar, literature, and history.'),
  ('english_literature', 'اللغة الإنجليزية وآدابها', 'English Literature', 'Humanities', 65, 60, '80-85', 'دراسة اللغة الإنجليزية وأدبها وفنونها.', 'Study of the English language, its literature, and arts.'),
  ('journalism', 'الصحافة والإعلام', 'Journalism', 'Humanities', 65, 60, '80-85', 'دراسة فن الخبر والتحقيق والعمل الإعلامي.', 'Study of news art, investigation, and media work.'),
  ('social_work', 'الخدمة الاجتماعية', 'Social Work', 'Humanities', 65, 60, '70-75', 'دراسة كيفية دعم الأفراد والمجتمعات ومساندتهم.', 'Study of how to support and assist individuals and communities.'),
  ('psychology', 'علم النفس', 'Psychology', 'Humanities', 65, 60, '80-85', 'دراسة سلوك الإنسان والعمليات الذهنية والنفسية.', 'Study of human behavior and mental and psychological processes.'),
  ('education', 'التربية', 'Education', 'Humanities', 65, 60, '75-80', 'دراسة أساليب التدريس والتعلم وتطوير المهارات.', 'Study of teaching and learning methods and skill development.'),
  ('translation', 'الترجمة', 'Translation', 'Humanities', 65, 60, '80-85', 'دراسة نقل النصوص والخطابات بين اللغات المختلفة.', 'Study of transferring texts and speeches between different languages.'),
  -- NEW Law/Languages majors
  ('french_language', 'اللغة الفرنسية وآدابها', 'French Language & Literature', 'Humanities', 65, 60, '78-83', 'دراسة اللغة الفرنسية وقواعدها وأدبها وثقافتها للعمل في الترجمة والسياحة والعلاقات الدولية.', 'Study of the French language, its grammar, literature, and culture for careers in translation, tourism, and international relations.'),
  ('philosophy', 'الفلسفة', 'Philosophy', 'Humanities', 63, 58, '72-77', 'دراسة الفكر الفلسفي والمنطق والنظريات المعرفية لتطوير التفكير النقدي والتحليلي.', 'Study of philosophical thought, logic, and epistemic theories to develop critical and analytical thinking.'),
  ('geography_major', 'الجغرافيا', 'Geography', 'Humanities', 63, 58, '70-75', 'دراسة الظواهر الطبيعية والبشرية وتوزيعها المكاني باستخدام نظم المعلومات الجغرافية.', 'Study of natural and human phenomena and their spatial distribution using Geographic Information Systems.'),
  ('library_science', 'علم المكتبات والمعلومات', 'Library & Information Science', 'Humanities', 63, 58, '68-73', 'تنظيم وإدارة مصادر المعلومات والمكتبات الرقمية والتقليدية وتقديم خدمات المعرفة.', 'Organizing and managing information resources, digital and traditional libraries, and providing knowledge services.'),

  -- ======================== Business ========================
  ('business_admin', 'إدارة الأعمال', 'Business Administration', 'Business', 65, 60, '80-85', 'دراسة مبادئ الإدارة وتنظيم المنشآت.', 'Study of management principles and organizational structures.'),
  ('accounting', 'المحاسبة', 'Accounting', 'Business', 65, 60, '75-80', 'دراسة العمليات المالية وكيفية رصدها وتحليلها.', 'Study of financial operations and how to monitor and analyze them.'),
  ('finance_banking', 'التمويل والمصارف', 'Finance & Banking', 'Business', 65, 60, '75-80', 'دراسة الأسواق المالية والخدمات المصرفية والاستثمار.', 'Study of financial markets, banking services, and investment.'),
  ('economics', 'الاقتصاد', 'Economics', 'Business', 65, 60, '75-80', 'دراسة إنتاج وتوزيع واستهلاك السلع والخدمات.', 'Study of production, distribution, and consumption of goods and services.'),
  ('marketing', 'التسويق', 'Marketing', 'Business', 65, 60, '75-80', 'دراسة استراتيجيات الترويج وتلبية احتياجات العملاء.', 'Study of promotion strategies and meeting customer needs.'),
  ('supply_chain', 'سلاسل التوريد', 'Supply Chain', 'Business', 65, 60, '70-75', 'دراسة تدفق البضائع والخدمات من المصدر إلى المستهلك.', 'Study of the flow of goods and services from source to consumer.'),
  ('entrepreneurship', 'الريادة والابتكار', 'Entrepreneurship', 'Business', 65, 60, '75-80', 'دراسة كيفية بناء المشاريع وتطوير الأفكار الجديدة.', 'Study of how to build projects and develop new ideas.'),
  ('human_resources', 'الموارد البشرية', 'Human Resources', 'Business', 65, 60, '75-80', 'دراسة كيفية اختيار وتدريب وتحفيز الكوادر البشرية.', 'Study of how to select, train, and motivate human resources.'),
  ('digital_business', 'الأعمال الرقمية', 'Digital Business', 'Business', 65, 60, '80-85', 'استخدام التكنولوجيا الرقمية لتحسين أداء الأعمال.', 'Using digital technology to improve business performance.'),
  -- NEW Business majors
  ('hospitality_tourism', 'إدارة الضيافة والسياحة', 'Hospitality & Tourism Management', 'Business', 63, 58, '72-78', 'دراسة إدارة الفنادق والمنتجعات والخدمات السياحية وتنظيم الفعاليات في قطاع الضيافة.', 'Study of hotel, resort, and tourism services management and event organization in the hospitality sector.'),
  ('insurance', 'التأمين وإدارة المخاطر', 'Insurance & Risk Management', 'Business', 63, 58, '70-75', 'دراسة مبادئ التأمين وتقييم المخاطر وإدارة المحافظ التأمينية.', 'Study of insurance principles, risk assessment, and management of insurance portfolios.'),
  ('public_administration', 'الإدارة العامة', 'Public Administration', 'Business', 65, 60, '73-78', 'دراسة إدارة المؤسسات الحكومية والسياسات العامة وتطوير الخدمات المجتمعية.', 'Study of managing government institutions, public policies, and developing community services.'),
  ('real_estate', 'إدارة العقارات', 'Real Estate Management', 'Business', 63, 58, '70-75', 'دراسة تقييم وتطوير وتسويق وإدارة الممتلكات العقارية.', 'Study of property valuation, development, marketing, and management.');

-- ============================================================
-- SEED DATA: FIELD_MAJORS
-- ============================================================

INSERT INTO field_majors (field_id, major_id)
VALUES
  -- Health (original + new)
  ('health', 'medicine'), ('health', 'dentistry'), ('health', 'pharmacy'), ('health', 'nursing'), ('health', 'medical_lab'), ('health', 'physiotherapy'), ('health', 'nutrition'), ('health', 'veterinary'), ('health', 'biomedical'),
  ('health', 'radiology'), ('health', 'occupational_therapy'), ('health', 'speech_therapy'), ('health', 'public_health'), ('health', 'optometry'),
  -- Engineering & Tech (original + new)
  ('engineering_tech', 'civil_engineering'), ('engineering_tech', 'electrical_engineering'), ('engineering_tech', 'mechanical_engineering'), ('engineering_tech', 'computer_engineering'), ('engineering_tech', 'computer_science'), ('engineering_tech', 'artificial_intelligence'), ('engineering_tech', 'data_science'), ('engineering_tech', 'architecture'), ('engineering_tech', 'cybersecurity'),
  ('engineering_tech', 'chemical_engineering'), ('engineering_tech', 'industrial_engineering'), ('engineering_tech', 'environmental_engineering'), ('engineering_tech', 'software_engineering'), ('engineering_tech', 'network_engineering'),
  -- Law, Sharia & Languages (original + new)
  ('law_sharia_languages', 'law'), ('law_sharia_languages', 'sharia'), ('law_sharia_languages', 'arabic_literature'), ('law_sharia_languages', 'english_literature'), ('law_sharia_languages', 'journalism'), ('law_sharia_languages', 'social_work'), ('law_sharia_languages', 'psychology'), ('law_sharia_languages', 'education'), ('law_sharia_languages', 'translation'),
  ('law_sharia_languages', 'french_language'), ('law_sharia_languages', 'philosophy'), ('law_sharia_languages', 'geography_major'), ('law_sharia_languages', 'library_science'),
  -- Business (original + new)
  ('business', 'business_admin'), ('business', 'accounting'), ('business', 'finance_banking'), ('business', 'economics'), ('business', 'marketing'), ('business', 'supply_chain'), ('business', 'entrepreneurship'), ('business', 'human_resources'), ('business', 'digital_business'),
  ('business', 'hospitality_tourism'), ('business', 'insurance'), ('business', 'public_administration'), ('business', 'real_estate');

-- ============================================================
-- SEED DATA: CAREERS
-- ============================================================

INSERT INTO careers (id, title_ar, title_en, demand_level, growth_trend, description_ar, description_en)
VALUES
  -- Original careers
  ('surgeon', 'جراح', 'Surgeon', 'High', 'Steady', 'طبيب متخصص في إجراء العمليات الجراحية.', 'Doctor specializing in performing surgeries.'),
  ('orthodontist', 'أخصائي تقويم أسنان', 'Orthodontist', 'Medium', 'Steady', 'طبيب أسنان متخصص في تقويم الأسنان والفكين.', 'Dentist specializing in straightening teeth and jaws.'),
  ('pharmacist', 'صيدلي', 'Pharmacist', 'High', 'Growing', 'خبير في الأدوية وصرف الوصفات الطبية.', 'Expert in medicines and dispensing prescriptions.'),
  ('registered_nurse', 'ممرض قانوني', 'Registered Nurse', 'Very High', 'Growing', 'ممارس رعاية صحية يقدم الرعاية المباشرة للمرضى.', 'Healthcare practitioner providing direct patient care.'),
  ('lab_technician', 'فني مختبر', 'Lab Technician', 'Medium', 'Steady', 'فني يقوم بإجراء الاختبارات المعملية.', 'Technician who performs laboratory tests.'),
  ('physiotherapist', 'معالج طبيعي', 'Physiotherapist', 'High', 'Growing', 'محترف يساعد المرضى على استعادة الحركة.', 'Professional who helps patients regain movement.'),
  ('dietitian', 'أخصائي تغذية', 'Dietitian', 'Medium', 'Steady', 'خبير في التغذية ووضع الخطط الغذائية.', 'Expert in nutrition and setting dietary plans.'),
  ('vet_surgeon', 'جراح بيطري', 'Vet Surgeon', 'Medium', 'Steady', 'طبيب متخصص في جراحة الحيوانات.', 'Doctor specializing in animal surgery.'),
  ('biomedical_researcher', 'باحث طبي حيوي', 'Biomedical Researcher', 'High', 'Growing', 'باحث يدرس العمليات الحياتية لتطوير العلاجات.', 'Researcher studying life processes to develop treatments.'),
  ('structural_engineer', 'مهندس إنشائي', 'Structural Engineer', 'High', 'Steady', 'مهندس متخصص في تصميم هياكل المباني.', 'Engineer specializing in designing building structures.'),
  ('electrical_designer', 'مصمم كهربائي', 'Electrical Designer', 'Medium', 'Growing', 'مصمم للأنظمة والشبكات الكهربائية.', 'Designer of electrical systems and networks.'),
  ('mechanical_designer', 'مصمم ميكانيكي', 'Mechanical Designer', 'Medium', 'Growing', 'مصمم للآلات والمعدات الميكانيكية.', 'Designer of machines and mechanical equipment.'),
  ('embedded_systems_eng', 'مهندس أنظمة مدمجة', 'Embedded Systems Eng', 'High', 'Very High', 'مهندس يصمم أنظمة التحكم في الأجهزة.', 'Engineer who designs control systems in devices.'),
  ('software_developer', 'مطور برمجيات', 'Software Developer', 'Very High', 'Very High', 'محترف يقوم ببناء وتطوير تطبيقات الحاسوب.', 'Professional who builds and develops computer applications.'),
  ('ai_engineer', 'مهندس ذكاء اصطناعي', 'AI Engineer', 'Very High', 'Exponential', 'متخصص في بناء نماذج تعلم الآلة.', 'Specialist in building machine learning models.'),
  ('data_analyst', 'محلل بيانات', 'Data Analyst', 'High', 'Very High', 'خبير يقوم بتحويل البيانات إلى معلومات مفيدة.', 'Expert who turns data into useful information.'),
  ('architect', 'مهندس معماري', 'Architect', 'Medium', 'Steady', 'مهندس يصمم المساحات والمباني بجمالية.', 'Engineer who designs spaces and buildings aesthetically.'),
  ('security_analyst', 'محلل أمن معلومات', 'Security Analyst', 'Very High', 'Very High', 'خبير يحمي البيانات والشبكات من الاختراق.', 'Expert who protects data and networks from hacking.'),
  ('judge', 'قاضي', 'Judge', 'Medium', 'Steady', 'مسؤول قانوني يصدر الأحكام في المحاكم.', 'Legal official who issues judgments in courts.'),
  ('imam', 'إمام', 'Imam', 'Medium', 'Steady', 'قائد ديني يؤم المصلين ويقدم الفتاوى.', 'Religious leader who leads prayers and provides fatwas.'),
  ('author', 'كاتب/مؤلف', 'Author', 'Low', 'Neutral', 'شخص يكتب القصص والمقالات والكتب.', 'Person who writes stories, articles, and books.'),
  ('english_teacher', 'معلم لغة إنجليزية', 'English Teacher', 'High', 'Steady', 'معلم متخصص في تدريس اللغة الإنجليزية.', 'Teacher specializing in teaching English.'),
  ('reporter', 'مراسل صحفي', 'Reporter', 'Medium', 'Neutral', 'صحفي يغطي الأخبار من الميدان.', 'Journalist who covers news from the field.'),
  ('social_worker', 'باحث اجتماعي', 'Social Worker', 'High', 'Growing', 'محترف يدعم الأفراد في حل مشاكلهم الاجتماعية.', 'Professional who supports individuals in solving their social problems.'),
  ('counselor', 'مرشد نفسي', 'Counselor', 'High', 'Growing', 'متخصص يقدم الدعم النفسي والإرشادي.', 'Specialist who provides psychological and counseling support.'),
  ('school_principal', 'مدير مدرسة', 'School Principal', 'Medium', 'Steady', 'مسؤول يدير العمليات التعليمية والإدارية.', 'Official who manages educational and administrative operations.'),
  ('translator', 'مترجم', 'Translator', 'Medium', 'Steady', 'شخص ينقل المعاني بين لغتين أو أكثر.', 'Person who transfers meanings between two or more languages.'),
  ('ceo', 'مدير تنفيذي', 'CEO', 'Medium', 'Steady', 'أعلى مسؤول إداري في الشركة.', 'Highest administrative official in the company.'),
  ('auditor', 'مدقق حسابات', 'Auditor', 'High', 'Steady', 'محاسب يراجع السجلات المالية للتأكد من دقتها.', 'Accountant who reviews financial records for accuracy.'),
  ('investment_banker', 'مصرفي استثماري', 'Investment Banker', 'High', 'Growing', 'خبير في زيادة رأس المال وتقديم المشورة.', 'Expert in raising capital and providing advice.'),
  ('economist', 'خبير اقتصادي', 'Economist', 'Medium', 'Steady', 'باحث يدرس النظريات والاتجاهات الاقتصادية.', 'Researcher studying economic theories and trends.'),
  ('brand_manager', 'مدير علامة تجارية', 'Brand Manager', 'High', 'Growing', 'مسؤول عن الصورة الذهنية للمنتج في السوق.', 'Responsible for the mental image of the product in the market.'),
  ('logistics_manager', 'مدير خدمات لوجستية', 'Logistics Manager', 'High', 'Growing', 'مسؤول عن تنظيم تدفق البضائع.', 'Responsible for organizing the flow of goods.'),
  ('startup_founder', 'مؤسس شركة ناشئة', 'Startup Founder', 'Medium', 'High', 'مبتكر يبدأ مشروعاً جديداً.', 'Innovator who starts a new project.'),
  ('hr_specialist', 'أخصائي موارد بشرية', 'HR Specialist', 'High', 'Steady', 'مسؤول عن التوظيف وشؤون الموظفين.', 'Responsible for recruitment and employee affairs.'),
  ('e_commerce_manager', 'مدير تجارة إلكترونية', 'E-commerce Manager', 'Very High', 'Very High', 'مسؤول عن إدارة المبيعات عبر الإنترنت.', 'Responsible for managing online sales.'),

  -- NEW careers for new Health majors
  ('radiologic_technologist', 'فني أشعة', 'Radiologic Technologist', 'High', 'Growing', 'فني متخصص في تشغيل أجهزة التصوير الطبي وإنتاج صور تشخيصية عالية الجودة.', 'Technician specializing in operating medical imaging equipment and producing high-quality diagnostic images.'),
  ('mri_specialist', 'أخصائي رنين مغناطيسي', 'MRI Specialist', 'High', 'Growing', 'متخصص في تشغيل أجهزة الرنين المغناطيسي وتحليل الصور التشخيصية.', 'Specialist in operating MRI equipment and analyzing diagnostic images.'),
  ('occupational_therapist', 'معالج وظيفي', 'Occupational Therapist', 'High', 'Growing', 'محترف يساعد المرضى على التكيف واستعادة استقلاليتهم في الأنشطة اليومية.', 'Professional who helps patients adapt and regain independence in daily activities.'),
  ('rehab_specialist', 'أخصائي تأهيل', 'Rehabilitation Specialist', 'Medium', 'Growing', 'متخصص في برامج التأهيل الشامل للمرضى بعد الإصابات أو العمليات الجراحية.', 'Specialist in comprehensive rehabilitation programs for patients after injuries or surgeries.'),
  ('speech_pathologist', 'أخصائي نطق', 'Speech-Language Pathologist', 'High', 'Growing', 'معالج متخصص في تشخيص وعلاج اضطرابات النطق واللغة.', 'Therapist specializing in diagnosing and treating speech and language disorders.'),
  ('audiologist', 'أخصائي سمعيات', 'Audiologist', 'Medium', 'Steady', 'متخصص في تشخيص وعلاج مشاكل السمع والتوازن.', 'Specialist in diagnosing and treating hearing and balance problems.'),
  ('epidemiologist', 'عالم وبائيات', 'Epidemiologist', 'High', 'Very High', 'باحث يدرس أنماط الأمراض وانتشارها في المجتمعات لتطوير سياسات الوقاية.', 'Researcher studying disease patterns and spread in populations to develop prevention policies.'),
  ('health_inspector', 'مفتش صحي', 'Health Inspector', 'Medium', 'Steady', 'مسؤول عن مراقبة الالتزام بالمعايير الصحية في المنشآت.', 'Official responsible for monitoring compliance with health standards in facilities.'),
  ('optometrist', 'أخصائي بصريات', 'Optometrist', 'High', 'Growing', 'متخصص في فحص العيون وتصحيح مشاكل الإبصار ووصف النظارات والعدسات.', 'Specialist in eye examinations, correcting vision problems, and prescribing glasses and lenses.'),
  ('ophthalmic_technician', 'فني عيون', 'Ophthalmic Technician', 'Medium', 'Steady', 'فني يساعد طبيب العيون في الفحوصات والإجراءات.', 'Technician who assists the ophthalmologist in examinations and procedures.'),

  -- NEW careers for new Engineering majors
  ('process_engineer', 'مهندس عمليات', 'Process Engineer', 'High', 'Steady', 'مهندس يصمم ويحسّن العمليات الكيميائية والصناعية.', 'Engineer who designs and improves chemical and industrial processes.'),
  ('petrochemical_engineer', 'مهندس بتروكيماويات', 'Petrochemical Engineer', 'High', 'Steady', 'متخصص في تصنيع ومعالجة المنتجات البترولية والكيميائية.', 'Specialist in manufacturing and processing petroleum and chemical products.'),
  ('quality_engineer', 'مهندس ضبط جودة', 'Quality Engineer', 'High', 'Growing', 'مهندس متخصص في ضبط وتحسين جودة المنتجات والعمليات.', 'Engineer specializing in controlling and improving product and process quality.'),
  ('operations_manager', 'مدير عمليات', 'Operations Manager', 'High', 'Growing', 'مسؤول عن تخطيط وتنسيق عمليات الإنتاج والتشغيل.', 'Responsible for planning and coordinating production and operations.'),
  ('environmental_consultant', 'مستشار بيئي', 'Environmental Consultant', 'Medium', 'Growing', 'خبير يقدم المشورة حول تأثير المشاريع على البيئة وحلول الاستدامة.', 'Expert who advises on project environmental impact and sustainability solutions.'),
  ('water_treatment_eng', 'مهندس معالجة مياه', 'Water Treatment Engineer', 'High', 'Growing', 'مهندس متخصص في تصميم وتشغيل محطات تنقية ومعالجة المياه.', 'Engineer specializing in designing and operating water purification and treatment plants.'),
  ('software_architect', 'مهندس هيكلة برمجيات', 'Software Architect', 'Very High', 'Very High', 'متخصص في تصميم البنية العامة للأنظمة البرمجية الكبيرة.', 'Specialist in designing the overall architecture of large software systems.'),
  ('devops_engineer', 'مهندس DevOps', 'DevOps Engineer', 'Very High', 'Exponential', 'متخصص في أتمتة عمليات النشر والتكامل المستمر للبرمجيات.', 'Specialist in automating deployment and continuous integration of software.'),
  ('network_administrator', 'مدير شبكات', 'Network Administrator', 'High', 'Steady', 'مسؤول عن إدارة وصيانة شبكات الحاسوب والاتصالات.', 'Responsible for managing and maintaining computer and telecommunications networks.'),
  ('cloud_engineer', 'مهندس حوسبة سحابية', 'Cloud Engineer', 'Very High', 'Exponential', 'متخصص في تصميم وإدارة البنية التحتية السحابية.', 'Specialist in designing and managing cloud infrastructure.'),

  -- NEW careers for new Law/Languages majors
  ('french_teacher', 'معلم لغة فرنسية', 'French Teacher', 'Medium', 'Steady', 'معلم متخصص في تدريس اللغة الفرنسية.', 'Teacher specializing in teaching French.'),
  ('diplomatic_interpreter', 'مترجم ديبلوماسي', 'Diplomatic Interpreter', 'Medium', 'Steady', 'مترجم محترف يعمل في السفارات والمنظمات الدولية.', 'Professional interpreter working in embassies and international organizations.'),
  ('philosophy_researcher', 'باحث فلسفي', 'Philosophy Researcher', 'Low', 'Neutral', 'باحث متخصص في الدراسات الفلسفية والتحليل النقدي.', 'Researcher specializing in philosophical studies and critical analysis.'),
  ('ethics_consultant', 'مستشار أخلاقيات', 'Ethics Consultant', 'Medium', 'Growing', 'خبير يقدم المشورة حول القضايا الأخلاقية في المؤسسات والأبحاث.', 'Expert who advises on ethical issues in organizations and research.'),
  ('gis_specialist', 'أخصائي نظم معلومات جغرافية', 'GIS Specialist', 'High', 'Very High', 'متخصص في استخدام تقنيات نظم المعلومات الجغرافية لتحليل البيانات المكانية.', 'Specialist in using GIS technologies to analyze spatial data.'),
  ('urban_planner', 'مخطط حضري', 'Urban Planner', 'Medium', 'Growing', 'مختص في تخطيط المدن والمناطق الحضرية وتنظيم استخدام الأراضي.', 'Specialist in city and urban planning and land use organization.'),
  ('librarian', 'أمين مكتبة', 'Librarian', 'Medium', 'Steady', 'متخصص في تنظيم وإدارة المكتبات وخدمات المعلومات.', 'Specialist in organizing and managing libraries and information services.'),
  ('info_manager', 'مدير معلومات', 'Information Manager', 'High', 'Growing', 'مسؤول عن إدارة أنظمة المعلومات والأرشفة الرقمية في المؤسسات.', 'Responsible for managing information systems and digital archiving in organizations.'),

  -- NEW careers for new Business majors
  ('hotel_manager', 'مدير فندق', 'Hotel Manager', 'High', 'Growing', 'مسؤول عن إدارة العمليات اليومية للفنادق والمنتجعات.', 'Responsible for managing daily operations of hotels and resorts.'),
  ('tourism_director', 'مدير سياحة', 'Tourism Director', 'Medium', 'Growing', 'مسؤول عن تخطيط وتسويق البرامج والوجهات السياحية.', 'Responsible for planning and marketing tourism programs and destinations.'),
  ('insurance_underwriter', 'مكتتب تأمين', 'Insurance Underwriter', 'Medium', 'Steady', 'متخصص في تقييم المخاطر وتحديد شروط وأسعار وثائق التأمين.', 'Specialist in evaluating risks and determining terms and prices of insurance policies.'),
  ('claims_adjuster', 'مسوّي مطالبات', 'Claims Adjuster', 'Medium', 'Steady', 'محترف يحقق في مطالبات التأمين ويحدد مبالغ التعويضات.', 'Professional who investigates insurance claims and determines compensation amounts.'),
  ('government_analyst', 'محلل حكومي', 'Government Analyst', 'Medium', 'Steady', 'محلل يعمل على تطوير وتقييم السياسات والبرامج الحكومية.', 'Analyst working on developing and evaluating government policies and programs.'),
  ('city_manager', 'مدير بلدية', 'City Manager', 'Medium', 'Steady', 'مسؤول عن إدارة العمليات الإدارية والخدمات في البلديات.', 'Responsible for managing administrative operations and services in municipalities.'),
  ('real_estate_appraiser', 'مثمّن عقاري', 'Real Estate Appraiser', 'High', 'Growing', 'خبير في تقييم قيمة العقارات والممتلكات.', 'Expert in evaluating the value of real estate and properties.'),
  ('property_manager', 'مدير عقارات', 'Property Manager', 'High', 'Growing', 'مسؤول عن إدارة وصيانة وتأجير الممتلكات العقارية.', 'Responsible for managing, maintaining, and leasing real estate properties.');

-- ============================================================
-- SEED DATA: MAJOR_CAREERS
-- ============================================================

INSERT INTO major_careers (major_id, career_id)
VALUES
  -- Original major-career links
  ('medicine', 'surgeon'),
  ('dentistry', 'orthodontist'),
  ('pharmacy', 'pharmacist'),
  ('nursing', 'registered_nurse'),
  ('medical_lab', 'lab_technician'),
  ('physiotherapy', 'physiotherapist'),
  ('nutrition', 'dietitian'),
  ('veterinary', 'vet_surgeon'),
  ('biomedical', 'biomedical_researcher'),
  ('civil_engineering', 'structural_engineer'),
  ('electrical_engineering', 'electrical_designer'),
  ('mechanical_engineering', 'mechanical_designer'),
  ('computer_engineering', 'embedded_systems_eng'),
  ('computer_science', 'software_developer'),
  ('artificial_intelligence', 'ai_engineer'),
  ('data_science', 'data_analyst'),
  ('architecture', 'architect'),
  ('cybersecurity', 'security_analyst'),
  ('law', 'judge'),
  ('sharia', 'imam'),
  ('arabic_literature', 'author'),
  ('english_literature', 'english_teacher'),
  ('journalism', 'reporter'),
  ('social_work', 'social_worker'),
  ('psychology', 'counselor'),
  ('education', 'school_principal'),
  ('translation', 'translator'),
  ('business_admin', 'ceo'),
  ('accounting', 'auditor'),
  ('finance_banking', 'investment_banker'),
  ('economics', 'economist'),
  ('marketing', 'brand_manager'),
  ('supply_chain', 'logistics_manager'),
  ('entrepreneurship', 'startup_founder'),
  ('human_resources', 'hr_specialist'),
  ('digital_business', 'e_commerce_manager'),

  -- NEW Health major-career links
  ('radiology', 'radiologic_technologist'),
  ('radiology', 'mri_specialist'),
  ('occupational_therapy', 'occupational_therapist'),
  ('occupational_therapy', 'rehab_specialist'),
  ('speech_therapy', 'speech_pathologist'),
  ('speech_therapy', 'audiologist'),
  ('public_health', 'epidemiologist'),
  ('public_health', 'health_inspector'),
  ('optometry', 'optometrist'),
  ('optometry', 'ophthalmic_technician'),

  -- NEW Engineering major-career links
  ('chemical_engineering', 'process_engineer'),
  ('chemical_engineering', 'petrochemical_engineer'),
  ('industrial_engineering', 'quality_engineer'),
  ('industrial_engineering', 'operations_manager'),
  ('environmental_engineering', 'environmental_consultant'),
  ('environmental_engineering', 'water_treatment_eng'),
  ('software_engineering', 'software_architect'),
  ('software_engineering', 'devops_engineer'),
  ('network_engineering', 'network_administrator'),
  ('network_engineering', 'cloud_engineer'),

  -- NEW Law/Languages major-career links
  ('french_language', 'french_teacher'),
  ('french_language', 'diplomatic_interpreter'),
  ('philosophy', 'philosophy_researcher'),
  ('philosophy', 'ethics_consultant'),
  ('geography_major', 'gis_specialist'),
  ('geography_major', 'urban_planner'),
  ('library_science', 'librarian'),
  ('library_science', 'info_manager'),

  -- NEW Business major-career links
  ('hospitality_tourism', 'hotel_manager'),
  ('hospitality_tourism', 'tourism_director'),
  ('insurance', 'insurance_underwriter'),
  ('insurance', 'claims_adjuster'),
  ('public_administration', 'government_analyst'),
  ('public_administration', 'city_manager'),
  ('real_estate', 'real_estate_appraiser'),
  ('real_estate', 'property_manager');
