-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  birth_year INTEGER DEFAULT 2009,
  preferred_language TEXT DEFAULT 'ar',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE student_grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_key TEXT NOT NULL,
  subject_name_ar TEXT NOT NULL,
  subject_name_en TEXT NOT NULL,
  grade NUMERIC NOT NULL CHECK (grade >= 0 AND grade <= 100),
  cluster TEXT NOT NULL CHECK (cluster IN ('science', 'language', 'social', 'applied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE riasec_translations (
  onet_index INTEGER PRIMARY KEY,
  area TEXT NOT NULL,
  text_en TEXT NOT NULL,
  text_ar TEXT NOT NULL
);

CREATE TABLE assessment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  riasec_r NUMERIC NOT NULL,
  riasec_i NUMERIC NOT NULL,
  riasec_a NUMERIC NOT NULL,
  riasec_s NUMERIC NOT NULL,
  riasec_e NUMERIC NOT NULL,
  riasec_c NUMERIC NOT NULL,
  riasec_answers TEXT NOT NULL,
  big5_openness NUMERIC NOT NULL,
  big5_conscientiousness NUMERIC NOT NULL,
  big5_extraversion NUMERIC NOT NULL,
  big5_agreeableness NUMERIC NOT NULL,
  big5_neuroticism NUMERIC NOT NULL,
  field_1 TEXT NOT NULL,
  field_1_score NUMERIC NOT NULL,
  field_2 TEXT NOT NULL,
  field_2_score NUMERIC NOT NULL,
  field_3 TEXT NOT NULL,
  field_3_score NUMERIC NOT NULL,
  field_4 TEXT NOT NULL,
  field_4_score NUMERIC NOT NULL,
  grade_clusters JSONB,
  recommended_electives JSONB,
  onet_careers JSONB,
  ai_narrative_ar TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fields (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('scientific', 'humanities')),
  ministerial_mandatory JSONB NOT NULL,
  ministerial_elective_pool JSONB NOT NULL,
  school_subjects JSONB NOT NULL,
  riasec_ideal JSONB NOT NULL,
  bigfive_ideal JSONB NOT NULL,
  description_ar TEXT,
  description_en TEXT
);

CREATE TABLE majors (
  id TEXT PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  min_gpa_public NUMERIC,
  min_gpa_private NUMERIC,
  competitive_gpa_range TEXT,
  description_ar TEXT,
  description_en TEXT
);

CREATE TABLE field_majors (
  field_id TEXT REFERENCES fields(id),
  major_id TEXT REFERENCES majors(id),
  PRIMARY KEY (field_id, major_id)
);

CREATE TABLE careers (
  id TEXT PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  demand_level TEXT,
  growth_trend TEXT,
  description_ar TEXT,
  description_en TEXT
);

CREATE TABLE major_careers (
  major_id TEXT REFERENCES majors(id),
  career_id TEXT REFERENCES careers(id),
  PRIMARY KEY (major_id, career_id)
);

CREATE TABLE gemini_cache (
  prompt_hash TEXT PRIMARY KEY,
  response_ar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE major_careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE riasec_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gemini_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "grades_own" ON student_grades
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "results_own" ON assessment_results
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "results_public_read" ON assessment_results
  FOR SELECT USING (is_public = true);

CREATE POLICY "fields_public_read" ON fields
  FOR SELECT USING (true);

CREATE POLICY "majors_public_read" ON majors
  FOR SELECT USING (true);

CREATE POLICY "field_majors_public_read" ON field_majors
  FOR SELECT USING (true);

CREATE POLICY "careers_public_read" ON careers
  FOR SELECT USING (true);

CREATE POLICY "major_careers_public_read" ON major_careers
  FOR SELECT USING (true);

CREATE POLICY "riasec_public_read" ON riasec_translations
  FOR SELECT USING (true);
