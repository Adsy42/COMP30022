'use client';

import { useState, useEffect } from 'react';

interface Option {
  label: string;
  followUp?: FormQuestion;
}

interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'single' | 'multi';
  options?: Option[];
  order: number;
}

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: Omit<FormQuestion, 'id' | 'order'>) => void;
  initialQuestion?: FormQuestion | null;  // This determines if we're editing
}

export function AddQuestionModal({ isOpen, onClose, onAdd, initialQuestion }: AddQuestionModalProps) {
  const [formData, setFormData] = useState<Omit<FormQuestion, 'id' | 'order'>>({
    question: '',
    type: 'text',
    options: []
  });

  const [newOption, setNewOption] = useState('');

  const questionTypes = {
    text: 'Text',
    single: 'Single Select',
    multi: 'Multi Select'
  } as const;

  // Add ESC key listener
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens/closes or initialQuestion changes
  useEffect(() => {
    if (isOpen && initialQuestion) {
      setFormData({
        question: initialQuestion.question,
        type: initialQuestion.type,
        options: initialQuestion.options || []
      });
    } else if (!isOpen) {
      setFormData({
        question: '',
        type: 'text',
        options: []
      });
    }
  }, [isOpen, initialQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ question: '', type: 'text', options: [] });
    onClose();
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), { label: newOption.trim() }]
      }));
      setNewOption('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-lg w-full max-w-[500px] relative z-10 shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-6">
            {initialQuestion ? 'Edit Question' : 'Add New Question'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={formData.question} 
                  onChange={e => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  value={formData.type}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    type: e.target.value as FormQuestion['type'],
                    options: e.target.value === 'text' ? undefined : prev.options
                  }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.entries(questionTypes).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {(formData.type === 'single' || formData.type === 'multi') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newOption}
                      onChange={e => setNewOption(e.target.value)}
                      placeholder="Enter option text"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-100 rounded-md 
                        hover:bg-gray-200 
                        focus-visible:bg-gray-200 
                        focus-visible:outline-none 
                        focus-visible:ring-2 
                        focus-visible:ring-gray-400 
                        focus-visible:ring-offset-2 
                        active:bg-gray-300
                        transition-all"
                      title="Add option"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {formData.options?.map((option, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md group"
                      >
                        <span className="text-sm text-gray-700">{option.label}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            options: prev.options?.filter((_, i) => i !== index)
                          }))}
                          className="invisible group-hover:visible p-1.5 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                          title="Remove option"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
              >
                {initialQuestion ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}