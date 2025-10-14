import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { QuestionCard } from './QuestionCard';

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
  displayable: boolean;
}

interface QuestionListProps {
  questions: FormQuestion[];
  onDragEnd: (result: any) => void;
  onEdit: (question: FormQuestion) => void;
  onDelete: (id: string) => void;
}

export function QuestionList({ questions, onDragEnd, onEdit, onDelete }: QuestionListProps) {
  return (
    <div className="max-h-[360px] overflow-y-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided: import('@hello-pangea/dnd').DroppableProvided) => (
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
                  {(provided: import('@hello-pangea/dnd').DraggableProvided) => (
                    <QuestionCard
                      question={question}
                      provided={provided}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}