import type { FieldId } from '../types';

export const fieldData: Record<FieldId, {
  name: { ar: string; en: string };
  gradient: string;
  description: { ar: string; en: string };
  majors: { ar: string; en: string }[];
  mandatory_subjects: { ar: string; en: string }[];
  icon: string;
  color: string;
}> = {
  health: {
    name: { ar: 'الحقل الصحي', en: 'Health Sciences' },
    gradient: 'from-emerald-500 to-teal-400',
    color: '#10b981',
    icon: '🏥',
    description: {
      ar: 'يختص بالعلوم الطبية والصحية والبحث العلمي الحيوي.',
      en: 'Focuses on medical, health, and biomedical research sciences.',
    },
    mandatory_subjects: [
      { ar: 'الكيمياء',                    en: 'Chemistry' },
      { ar: 'العلوم الحياتية',             en: 'Life Sciences' },
      { ar: 'اللغة الإنجليزية المتقدمة',   en: 'Advanced English' },
    ],
    majors: [
      { ar: 'الطب البشري',                       en: 'Medicine' },
      { ar: 'طب الأسنان',                        en: 'Dentistry' },
      { ar: 'الصيدلة',                           en: 'Pharmacy' },
      { ar: 'التمريض',                           en: 'Nursing' },
      { ar: 'المختبرات الطبية',                  en: 'Medical Laboratory' },
      { ar: 'العلاج الطبيعي',                    en: 'Physical Therapy' },
      { ar: 'التغذية وعلم الأغذية',              en: 'Nutrition & Food Science' },
      { ar: 'الصحة العامة',                      en: 'Public Health' },
      { ar: 'التخدير وغرف العمليات',             en: 'Anesthesia & Surgery' },
      { ar: 'الأشعة والتصوير الطبي',            en: 'Radiology & Medical Imaging' },
      { ar: 'القبالة وصحة الأم',                 en: 'Midwifery & Maternal Health' },
      { ar: 'الطب البيطري',                      en: 'Veterinary Medicine' },
      { ar: 'الصيدلة الإكلينيكية',               en: 'Clinical Pharmacy' },
      { ar: 'إدارة المستشفيات',                  en: 'Hospital Administration' },
      { ar: 'علم الأحياء الدقيقة والمناعة',      en: 'Microbiology & Immunology' },
    ],
  },
  engineering_tech: {
    name: { ar: 'حقل العلوم والتكنولوجيا والهندسة', en: 'Engineering & Technology' },
    gradient: 'from-blue-500 to-cyan-400',
    color: '#3b82f6',
    icon: '⚙️',
    description: {
      ar: 'يجمع بين التفكير الرياضي والهندسي والمهارات الرقمية المتقدمة.',
      en: 'Combines mathematical thinking, engineering, and advanced digital skills.',
    },
    mandatory_subjects: [
      { ar: 'الرياضيات المتقدمة',          en: 'Advanced Mathematics' },
      { ar: 'الفيزياء',                    en: 'Physics' },
      { ar: 'اللغة الإنجليزية المتقدمة',   en: 'Advanced English' },
    ],
    majors: [
      { ar: 'هندسة الحاسوب',                        en: 'Computer Engineering' },
      { ar: 'الذكاء الاصطناعي وتعلم الآلة',         en: 'AI & Machine Learning' },
      { ar: 'الهندسة المدنية',                       en: 'Civil Engineering' },
      { ar: 'علم البيانات',                          en: 'Data Science' },
      { ar: 'العمارة والتصميم العمراني',              en: 'Architecture & Urban Design' },
      { ar: 'الهندسة الكهربائية',                    en: 'Electrical Engineering' },
      { ar: 'هندسة الاتصالات',                       en: 'Telecommunications Engineering' },
      { ar: 'هندسة الميكاترونيكس',                   en: 'Mechatronics Engineering' },
      { ar: 'هندسة الطاقة المتجددة',                 en: 'Renewable Energy Engineering' },
      { ar: 'أمن المعلومات والشبكات',                en: 'Cybersecurity & Networks' },
      { ar: 'هندسة الطيران',                         en: 'Aeronautical Engineering' },
      { ar: 'هندسة البيئة والمياه',                  en: 'Environmental & Water Engineering' },
      { ar: 'الهندسة الصناعية',                      en: 'Industrial Engineering' },
      { ar: 'تكنولوجيا المعلومات',                   en: 'Information Technology' },
      { ar: 'هندسة البيوطبي',                        en: 'Biomedical Engineering' },
    ],
  },
  business: {
    name: { ar: 'حقل الأعمال والإدارة', en: 'Business & Management' },
    gradient: 'from-amber-500 to-orange-400',
    color: '#f59e0b',
    icon: '💼',
    description: {
      ar: 'يركز على مهارات القيادة والتحليل المالي والإدارة الممنهجة.',
      en: 'Focuses on leadership, financial analysis, and systematic management.',
    },
    mandatory_subjects: [
      { ar: 'رياضيات الأعمال',             en: 'Business Mathematics' },
      { ar: 'الثقافة المالية',             en: 'Financial Literacy' },
      { ar: 'اللغة الإنجليزية المتقدمة',   en: 'Advanced English' },
    ],
    majors: [
      { ar: 'إدارة الأعمال',                         en: 'Business Administration' },
      { ar: 'المحاسبة والمراجعة',                    en: 'Accounting & Auditing' },
      { ar: 'التسويق الرقمي',                        en: 'Digital Marketing' },
      { ar: 'التمويل والمصارف',                      en: 'Finance & Banking' },
      { ar: 'سلاسل التوريد واللوجستيات',             en: 'Supply Chain & Logistics' },
      { ar: 'ريادة الأعمال والابتكار',               en: 'Entrepreneurship & Innovation' },
      { ar: 'إدارة الفنادق والسياحة',                en: 'Hotel & Tourism Management' },
      { ar: 'اقتصاديات الأعمال',                     en: 'Business Economics' },
      { ar: 'إدارة الموارد البشرية',                 en: 'Human Resources Management' },
      { ar: 'التجارة الإلكترونية',                   en: 'E-Commerce' },
      { ar: 'إدارة المشاريع',                        en: 'Project Management' },
      { ar: 'المحاسبة الإسلامية والمصرفية',          en: 'Islamic Accounting & Banking' },
      { ar: 'تحليل الأعمال والبيانات',               en: 'Business & Data Analytics' },
      { ar: 'العلاقات العامة والإعلام المؤسسي',      en: 'PR & Corporate Communications' },
      { ar: 'إدارة المبيعات والتوزيع',               en: 'Sales & Distribution Management' },
    ],
  },
  law_sharia_languages: {
    name: { ar: 'حقل العلوم الإنسانية والاجتماعية', en: 'Humanities & Social Sciences' },
    gradient: 'from-purple-500 to-pink-400',
    color: '#8b5cf6',
    icon: '⚖️',
    description: {
      ar: 'يستهدف المهارات اللغوية والإنسانية والوعي القانوني والاجتماعي.',
      en: 'Targets linguistic, humanistic, legal, and social awareness skills.',
    },
    mandatory_subjects: [
      { ar: 'اللغة العربية (تخصص)',         en: 'Arabic Language (Specialized)' },
      { ar: 'اللغة الإنجليزية المتقدمة',   en: 'Advanced English' },
      { ar: 'التربية الإسلامية (تخصص)',     en: 'Islamic Studies (Specialized)' },
    ],
    majors: [
      { ar: 'القانون العام',                          en: 'Public Law' },
      { ar: 'القانون التجاري',                        en: 'Commercial Law' },
      { ar: 'الشريعة الإسلامية',                     en: 'Islamic Sharia' },
      { ar: 'الشريعة والقانون',                       en: 'Sharia & Law' },
      { ar: 'اللغة الإنجليزية وآدابها',              en: 'English Language & Literature' },
      { ar: 'الترجمة والتعريب',                       en: 'Translation & Arabization' },
      { ar: 'الإعلام والاتصال',                       en: 'Media & Communication' },
      { ar: 'العلوم السياسية والعلاقات الدولية',     en: 'Political Science & Intl. Relations' },
      { ar: 'التربية وعلم النفس',                    en: 'Education & Psychology' },
      { ar: 'الدراسات الإسلامية',                    en: 'Islamic Studies' },
      { ar: 'الإرشاد النفسي والتربوي',               en: 'Psychological & Educational Counseling' },
      { ar: 'اللغة العربية وآدابها',                 en: 'Arabic Language & Literature' },
      { ar: 'الخدمة الاجتماعية',                     en: 'Social Work' },
      { ar: 'علم الاجتماع والأنثروبولوجيا',          en: 'Sociology & Anthropology' },
      { ar: 'الإعلام الرقمي والصحافة الإلكترونية',  en: 'Digital Media & Online Journalism' },
    ],
  },
};
