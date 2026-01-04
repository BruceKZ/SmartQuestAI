import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ExamStatus = 'ACTIVE' | 'PAUSED' | 'FINISHED'

interface ExamState {
  currentQuestionIndex: number
  answers: Record<string, any> // questionId -> answer
  status: ExamStatus
  timeRemaining: number // in seconds
  
  // Actions
  setQuestionIndex: (index: number) => void
  setAnswer: (questionId: string, answer: any) => void
  setStatus: (status: ExamStatus) => void
  tickTimer: () => void
  setTimeRemaining: (time: number) => void
  resetExam: () => void
}

export const useExamStore = create<ExamState>()(
  persist(
    (set) => ({
      currentQuestionIndex: 0,
      answers: {},
      status: 'ACTIVE',
      timeRemaining: 0,

      setQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId, answer) => 
        set((state) => ({ 
          answers: { ...state.answers, [questionId]: answer } 
        })),
      setStatus: (status) => set({ status }),
      tickTimer: () => set((state) => ({ 
        timeRemaining: Math.max(0, state.timeRemaining - 1) 
      })),
      setTimeRemaining: (time) => set({ timeRemaining: time }),
      resetExam: () => set({ 
        currentQuestionIndex: 0, 
        answers: {}, 
        status: 'ACTIVE', 
        timeRemaining: 0 
      }),
    }),
    {
      name: 'exam-storage',
    }
  )
)
