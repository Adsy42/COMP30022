'use client';

import { useState, useEffect } from 'react';

interface Option {
  label: string;
  followUps?: FormQuestion[]; // Changed from followUp to followUps array
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
  initialQuestion?: FormQuestion | null;
  isFollowUp?: boolean; 
}

export function AddQuestionModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  initialQuestion,
  isFollowUp = false
}: AddQuestionModalProps) {
  const [formData, setFormData] = useState<Omit<FormQuestion, 'id' | 'order'>>({
    question: '',
    type: 'text',
    options: []
  });

  const [newOption, setNewOption] = useState('');
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Add state to track which follow-up is being edited
  const [editingFollowUp, setEditingFollowUp] = useState<{
    optionIndex: number;
    followUp: FormQuestion;
  } | null>(null);

  const questionTypes = {
    text: 'Text',
    single: 'Single Select',
    multi: 'Multi Select'
  } as const;

  // Update ESC key listener to handle nested modals
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFollowUpModalOpen) {
          setIsFollowUpModalOpen(false);
          setSelectedOption(null);
        } else if (isOpen) {
          onClose();
          // Reset all state when closing the main modal
          setFormData({
            question: '',
            type: 'text',
            options: []
          });
          setNewOption('');
          setSelectedOption(null);
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, isFollowUpModalOpen]);

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

  // Update handleFollowUpAdd to handle multiple follow-ups
  const handleFollowUpAdd = (optionIndex: number, followUpQuestion: Omit<FormQuestion, 'id' | 'order'>) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map((opt, idx) => {
        if (idx !== optionIndex) return opt;

        const existingFollowUps = opt.followUps || [];
        
        if (editingFollowUp?.followUp.id) {
          // Edit existing follow-up
          return {
            ...opt,
            followUps: existingFollowUps.map(f => 
              f.id === editingFollowUp.followUp.id 
                ? { ...followUpQuestion, id: f.id, order: f.order }
                : f
            )
          };
        }
        
        // Add new follow-up
        return {
          ...opt,
          followUps: [
            ...existingFollowUps,
            {
              ...followUpQuestion,
              id: crypto.randomUUID(),
              order: existingFollowUps.length
            }
          ]
        };
      })
    }));
  };

  // Add handler to delete follow-up
  const handleDeleteFollowUp = (optionIndex: number, followUpId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.map((opt, idx) => 
        idx === optionIndex
          ? {
              ...opt,
              followUps: opt.followUps?.filter(f => f.id !== followUpId)
            }
          : opt
      )
    }));
  };

  if (!isOpen) return null;

  // Update onClose handler to also reset state
  const handleClose = () => {
    onClose();
    setFormData({
      question: '',
      type: 'text',
      options: []
    });
    setNewOption('');
    setSelectedOption(null);
  };

  // Update the backdrop click handler
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {!isFollowUpModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 pointer-events-auto" 
            onClick={handleClose}  // Use handleClose instead of onClose
          />
        )}
        
        {/* Modal Content */}
        <div 
          className={`
            bg-white rounded-lg w-[500px] relative 
            shadow-lg flex flex-col max-h-[80vh] 
            overflow-hidden transform 
            ${isFollowUpModalOpen ? 'translate-x-8 translate-y-8' : ''}
          `} 
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-900">
              {initialQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={formData.question} 
                  placeholder="Enter your question here"
                  onChange={e => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                        <div className="flex-1">
                          <span className="text-sm text-gray-700">{option.label}</span>
                          {option.followUps && option.followUps.length > 0 && (
                            <div className="ml-4 mt-1 space-y-1">
                              {option.followUps.map((followUp) => (
                                <div 
                                  key={followUp.id} 
                                  className="flex items-center justify-between text-xs text-gray-500 group/followup"
                                >
                                  <div>
                                    <div>Question: {followUp.question}</div>
                                    <div>Type: {questionTypes[followUp.type]}</div>
                                  </div>
                                  <div className="invisible group-hover/followup:visible flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingFollowUp({ optionIndex: index, followUp });
                                        setSelectedOption(option);
                                        setIsFollowUpModalOpen(true);
                                      }}
                                      className="p-1 text-gray-400 hover:text-gray-600"
                                      title="Edit follow-up"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteFollowUp(index, followUp.id)}
                                      className="p-1 text-gray-400 hover:text-red-600"
                                      title="Remove follow-up"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOption(option);
                              setEditingFollowUp(null);
                              setIsFollowUpModalOpen(true);
                            }}
                            className="invisible group-hover:visible p-1.5 text-gray-400 hover:text-gray-600"
                            title="Add follow-up question"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}  // Use handleClose instead of onClose
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {isFollowUp ? 'Back' : 'Cancel'} 
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!formData.question.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-900 rounded-md hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {initialQuestion ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nested Follow-up Question Modal */}
      {isFollowUpModalOpen && (
        <AddQuestionModal
          isOpen={isFollowUpModalOpen}
          onClose={() => {
            setIsFollowUpModalOpen(false);
            setSelectedOption(null);
            setEditingFollowUp(null);
          }}
          onAdd={(followUpQuestion) => {
            const optionIndex = formData.options?.findIndex(opt => opt === selectedOption) ?? -1;
            if (optionIndex !== -1) {
              handleFollowUpAdd(optionIndex, followUpQuestion);
            }
            setIsFollowUpModalOpen(false);
            setSelectedOption(null);
            setEditingFollowUp(null);
          }}
          initialQuestion={editingFollowUp?.followUp}
          isFollowUp={true}
        />
      )}
    </>
  );
}