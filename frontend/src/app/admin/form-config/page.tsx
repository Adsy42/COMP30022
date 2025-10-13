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

  // Fetch questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetchMockQuestions();
        setQuestions(response.data);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order numbers
    const updatedQuestions = items.map((question, index) => ({
      ...question,
      order: index
    }));
    
    // Optimistically update UI
    setQuestions(updatedQuestions);
    
    // TODO: Implement API call to update order
    try {
      // await fetch(API_ENDPOINTS.REORDER, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     questions: updatedQuestions.map(({ id, order }) => ({ id, order }))
      //   })
      // });
      
      console.log('Order updated:', {
        question: reorderedItem.text,
        from: result.source.index,
        to: result.destination.index
      });
    } catch (err) {
      // Revert on failure
      setQuestions(questions);
      setError('Failed to update question order');
    }
  };

  // Add navigation component with back button
  const navActions = (
    <Link 
      href="/admin" 
      className="inline-flex items-center text-sm text-blue-900 hover:text-gray-900"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Dashboard
    </Link>
  );

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
            Modify form question text, order, nesting, and analytics display
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
            ) : error ? (
              <div className="py-8">
                <p className="text-center text-red-600">{error}</p>
              </div>
            ) : (
              <>
                <QuestionList 
                  questions={questions}
                  onDragEnd={handleDragEnd}
                  // TODO: Implement edit and delete handlers
                  // onEdit={handleEdit}
                  // onDelete={handleDelete}
                />
                
                {/* Keep Add New Question button outside scroll area */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {/* TODO: Implement add question */}}
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
    </div>
  );
}