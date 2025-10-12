'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Types for API responses
interface APIResponse<T> {
  data: T;
  error?: string;
}

interface FormQuestion {
  id: string;
  text: string;
  type: 'text' | 'single select' | 'multi select';
  required: boolean;
  options?: string[];
  order: number; // Added for backend ordering
}

// Mock data - Replace with API call later
const INITIAL_QUESTIONS: FormQuestion[] = [
  {
    id: '1',
    text: 'Grant Scheme',
    type: 'single select',
    required: true,
    options: ['NHMRC', 'MRFF', 'ARC', 'Other'],
    order: 0
  },
  {
    id: '2',
    text: 'Involves MRI',
    type: 'single select',
    required: true,
    options: ['Yes', 'No', 'Other'],
    order: 1
  }
];

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
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(API_ENDPOINTS.QUESTIONS);
        // const data: APIResponse<FormQuestion[]> = await response.json();
        
        // Temporary: Use mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setQuestions(INITIAL_QUESTIONS);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
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

  if (isLoading) return <div className="p-4">Loading questions...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar actions={navActions} />

      {/* Main content container */}
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((question, index) => (
                  <Draggable 
                    key={question.id} 
                    draggableId={question.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {question.text}
                            </h3>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-sm rounded">
                                {question.type}
                              </span>
                              {question.required && (
                                <span className="px-2 py-0.5 bg-gray-100 text-sm rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            {question.options && (
                              <p className="text-sm text-gray-500 mt-1">
                                Options: {question.options.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>
    </div>
  );
}
