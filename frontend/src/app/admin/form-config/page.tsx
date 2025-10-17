'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { QuestionList } from '@/components/QuestionList';
import { 
  FormQuestion, 
  fetchMockQuestions,
  reorderMockQuestions 
} from './__mocks__/questions';
import { AddQuestionModal } from '@/components/AddQuestionModal';

// API endpoints - Update when backend is implemented
const API_ENDPOINTS = {
  QUESTIONS: '/api/form-questions',
  REORDER: '/api/form-questions/reorder'
} as const;

// Navigation component with back button
const navActions = (
  <Link 
    href="/admin" 
    className="inline-flex items-center text-sm text-blue-900 hover:text-gray-900"
  >
    <ArrowLeft className="w-4 h-4 mr-2" />
    Back to Dashboard
  </Link>
)

export default function FormConfigPage() {
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<FormQuestion | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Update useEffect with better error handling
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchMockQuestions();
        setQuestions(response.data);
      } catch (err) {
        setError('Unable to load questions. Please refresh the page or try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Update handlers with error states
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const originalQuestions = [...questions];
    try {
      setActionError(null);
      setQuestions(items.map((q, index) => ({ ...q, order: index })));
      // TODO: Implement API call to update order
      // await fetch(API_ENDPOINTS.REORDER, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     questions: updatedQuestions.map(({ id, order }) => ({ id, order }))
      //   })
      // });
      
      console.log('Orders updated:', {
        moved: {
          question: reorderedItem.question,
          from: result.source.index,
          to: result.destination.index
        },
        newOrders: items.map(q => ({ id: q.id, order: q.order }))
      });
    } catch (err) {
      setQuestions(originalQuestions);
      setActionError('Failed to reorder questions. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    const originalQuestions = [...questions];
    try {
      setActionError(null);
      setQuestions(questions.filter(q => q.id !== id));
      // TODO: Implement actual API call when backend is ready
      // await fetch(`${API_ENDPOINTS.QUESTIONS}/${id}`, {
      //   method: 'DELETE'
      // });
      
      console.log('Question deleted:', id);
    } catch (err) {
      setQuestions(originalQuestions);
      setActionError('Failed to delete question. Please try again.');
    }
  };

  // Add handler for new questions
  const handleAddQuestion = (newQuestion: Omit<FormQuestion, 'id' | 'order'>) => {
    try {
      // Create new question with generated ID and order
      const question: FormQuestion = {
        ...newQuestion,
        id: crypto.randomUUID(), // This will be replaced by server-generated ID
        order: questions.length
      };

      // Optimistically update UI
      setQuestions([...questions, question]);
      
      // TODO: Implement actual API call when backend is ready
      // const response = await fetch(API_ENDPOINTS.QUESTIONS, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(question)
      // });
      // const data = await response.json();
      
      console.log('Question added:', question);
    } catch (err) {
      // Revert on failure
      setQuestions(questions);
      setError('Failed to add question');
    }
  };

  const handleEdit = (question: FormQuestion) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedQuestion: Omit<FormQuestion, 'id' | 'order'>) => {
    if (!editingQuestion) return;

    try {
      // Optimistically update UI
      setQuestions(questions.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...updatedQuestion }
          : q
      ));

      // TODO: Implement actual API call when backend is ready
      // await fetch(`${API_ENDPOINTS.QUESTIONS}/${editingQuestion.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedQuestion)
      // });

      console.log('Question updated:', { id: editingQuestion.id, ...updatedQuestion });
    } catch (err) {
      // Revert on failure
      setQuestions(questions);
      setError('Failed to update question');
    } finally {
      setEditingQuestion(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar actions={navActions} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-blue-900 mb-2">
            Form Configuration
          </h1>
          <p className="text-gray-500 mt-1">
            Configure form questions, add follow-up logic, and manage analytics settings. Drag questions to reorder
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-gray-100 rounded-full p-1 flex mb-8 w-full">
          {/* Form configuration tab (active) */}
          <Link 
            href="/admin/form-config"
            className="flex-1 px-4 py-2 rounded-full flex items-center justify-center gap-2 bg-white shadow-sm font-medium"
          >
            <svg className="w-5 h-5 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Form Configuration
          </Link>
          {/* Email configuration tab */}
          <Link 
            href="/admin/email-config"
            className="flex-1 px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 font-medium"
          >
            <svg className="w-5 h-5 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Configuration
          </Link>
        </div>

        {/* Error Alert */}
        {(error || actionError) && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error || actionError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-6">
              Manage Form Questions
            </h2>

            {isLoading ? (
              <div className="py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
                </div>
                <p className="text-center text-gray-500 mt-4">Loading questions...</p>
              </div>
            ) : questions.length === 0 && !error ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">No questions found</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-900 hover:text-blue-700 font-medium"
                >
                  Add your first question
                </button>
              </div>
            ) : (
                <>
                <QuestionList 
                  questions={questions}
                  onDragEnd={handleDragEnd}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {/* Keep Add New Question button outside scroll area */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <svg 
                      className="w-5 h-5 mr-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                      />
                    </svg>
                    Add New Question
                  </button>
                </div>
                </>
            )}
          </div>
        </div>
      </main>

      <AddQuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
          setActionError(null);
        }}
        onAdd={editingQuestion ? handleUpdate : handleAddQuestion}
        initialQuestion={editingQuestion ?? undefined}
      />
    </div>
  );
}