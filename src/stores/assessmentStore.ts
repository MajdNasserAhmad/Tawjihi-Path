import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentStore } from '../types';

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      grades: {},
      riasecAnswers: {},
      riasecAnswerString: '',
      bigfiveItems: [],
      questionnaireId: undefined,
      currentStep: 'grades',

      setGrade: (subjectKey, value) => 
        set((state) => ({
          grades: { ...state.grades, [subjectKey]: value }
        })),

      setRiasecAnswer: (index, value) => {
        const newAnswers = { ...get().riasecAnswers, [index]: value };
        // Build 30-digit string (digits 1-5, padding with '3' for unanswered)
        const answerString = Array.from({ length: 30 }, (_, i) => newAnswers[i + 1] || 3).join('');
        
        set({
          riasecAnswers: newAnswers,
          riasecAnswerString: answerString
        });
      },

      setBigfiveItems: (items) => set({ bigfiveItems: items }),

      setBigfiveResponse: (index, response) => 
        set((state) => ({
          bigfiveItems: state.bigfiveItems.map((item) => 
            item.index === index ? { ...item, response } : item
          )
        })),

      setQuestionnaireId: (id) => set({ questionnaireId: id }),

      setCurrentStep: (step) => set({ currentStep: step }),

      reset: () => set({
        grades: {},
        riasecAnswers: {},
        riasecAnswerString: '',
        bigfiveItems: [],
        questionnaireId: undefined,
        currentStep: 'grades'
      }),
    }),
    {
      name: 'tawjihi-assessment-storage',
    }
  )
);
