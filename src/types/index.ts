export type FieldId =
  | 'health'
  | 'engineering_tech'
  | 'law_sharia_languages'
  | 'business';

export type RIASECScores = {
  R: number; I: number; A: number; S: number; E: number; C: number;
};

export type BigFiveScores = {
  O: number; C: number; E: number; A: number; N: number;
};

export type GradeClusters = {
  science: number; language: number; social: number; applied: number;
};

export type FieldResult = {
  field_id: FieldId;
  score: number; // 0-100
  elective: string;
};

export interface AssessmentResult {
  id: string;
  student_id: string;
  riasec_scores: RIASECScores;
  riasec_answers: string;
  bigfive_scores: BigFiveScores;
  fields_ranked: FieldResult[]; // always 4 items, index 0 = best match
  grade_clusters: GradeClusters;
  recommended_electives: Record<FieldId, string>;
  onet_careers: OnetCareer[];
  ai_narrative_ar: string;
  is_public: boolean;
  pdf_url: string | null;
  created_at: string;
}

export type OnetCareer = {
  code: string;
  title: string;
};

export type BigFiveItem = {
  index: number;
  text_en: string;  // original English — sent to Sentino for scoring
  text_ar: string;  // Arabic — shown to student
  response: SentinoResponse | null;
};

export type SentinoResponse =
  | 'strongly disagree'
  | 'disagree'
  | 'neither agree nor disagree'
  | 'agree'
  | 'strongly agree';

export type RIASECQuestion = {
  onet_index: number;
  area: string;
  text_en: string;
  text_ar: string;
};

export type Field = {
  id: FieldId;
  name_ar: string;
  name_en: string;
  type: 'scientific' | 'humanities';
  ministerial_mandatory: string[];
  ministerial_elective_pool: string[];
  school_subjects: string[];
  riasec_ideal: RIASECScores;
  bigfive_ideal: BigFiveScores & { N_inv: number };
  description_ar: string | null;
  description_en: string | null;
};

export type Major = {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  min_gpa_public: number | null;
  min_gpa_private: number | null;
  competitive_gpa_range: string | null;
  description_ar: string | null;
};

export type Career = {
  id: string;
  title_ar: string;
  title_en: string;
  demand_level: string | null;
  growth_trend: string | null;
  description_ar: string | null;
};

export interface AssessmentStore {
  grades: Record<string, number>;
  riasecAnswers: Record<number, number>;
  riasecAnswerString: string;
  bigfiveItems: BigFiveItem[];
  questionnaireId?: string;
  currentStep: 'grades' | 'riasec' | 'personality' | 'processing' | 'results';
  setGrade: (subjectKey: string, value: number) => void;
  setRiasecAnswer: (index: number, value: number) => void;
  setBigfiveItems: (items: BigFiveItem[]) => void;
  setBigfiveResponse: (index: number, response: SentinoResponse) => void;
  setQuestionnaireId: (id: string) => void;
  setCurrentStep: (step: AssessmentStore['currentStep']) => void;
  reset: () => void;
}
