interface Option {
  label: string
  followUps?: FormQuestion[]
}

interface FormQuestion {
  id: string
  question: string
  type: 'text' | 'single' | 'multi'
  options?: Option[]
  order: number
}

interface QuestionCardProps {
  question: FormQuestion
  provided: any
  onEdit: (question: FormQuestion) => void
  onDelete: (id: string) => void
}

export function QuestionCard({
  question,
  provided,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  const getDisplayType = (type: 'text' | 'single' | 'multi') => {
    switch (type) {
      case 'text':
        return 'Text'
      case 'single':
        return 'Single Select'
      case 'multi':
        return 'Multi Select'
      default:
        return type
    }
  }

  const getTotalFollowUps = (options?: Option[]): number => {
    if (!options) return 0
    return options.reduce((total, opt) => {
      const directFollowUps = opt.followUps?.length || 0
      const nestedFollowUps =
        opt.followUps?.reduce(
          (sum, followUp) => sum + getTotalFollowUps(followUp.options),
          0
        ) || 0
      return total + directFollowUps + nestedFollowUps
    }, 0)
  }

  const renderFollowUps = (followUps: FormQuestion[], level: number = 0) => {
    return followUps.map(followUp => (
      <div key={followUp.id}>
        <div
          className="text-xs text-gray-500 flex items-center gap-1"
          style={{ marginLeft: `${level * 1}rem` }}
        >
          <span>{'↳'.repeat(level + 1)}</span>
          <span>{followUp.question}</span>
          <span className="text-gray-400">
            ({getDisplayType(followUp.type)})
          </span>
          {followUp.options &&
            followUp.options.some(opt => opt.followUps?.length) && (
              <span className="text-xs text-green-600 font-medium">
                ({getTotalFollowUps(followUp.options)} nested follow-ups)
              </span>
            )}
        </div>
        {followUp.options?.map((opt, optIndex) => (
          <div key={optIndex} style={{ marginLeft: `${(level + 1) * 1}rem` }}>
            {opt.followUps && opt.followUps.length > 0 && (
              <div className="ml-4 mt-1">
                {renderFollowUps(opt.followUps, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    ))
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{question.question}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-gray-100 text-sm text-gray-600 rounded">
              {getDisplayType(question.type)}
            </span>
            {question.options && question.options.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-50 text-sm text-blue-600 rounded">
                {question.options.length} options
              </span>
            )}
            {getTotalFollowUps(question.options) > 0 && (
              <span className="px-2 py-0.5 bg-green-50 text-sm text-green-600 rounded">
                {getTotalFollowUps(question.options)} follow-ups
              </span>
            )}
          </div>

          {question.options && (
            <div className="mt-3 space-y-2">
              {question.options.map((opt, index) => (
                <div key={index} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">• {opt.label}</span>
                    {opt.followUps && opt.followUps.length > 0 && (
                      <span className="text-xs text-green-600 font-medium">
                        ({getTotalFollowUps([opt])} total follow-ups)
                      </span>
                    )}
                  </div>
                  {opt.followUps && opt.followUps.length > 0 && (
                    <div className="ml-4 mt-1  pl-2">
                      {renderFollowUps(opt.followUps)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(question)}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Edit question"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 hover:bg-gray-50 rounded-lg"
            title="Delete question"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
