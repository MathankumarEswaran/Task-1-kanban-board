import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PRIORITY_COLORS = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }

export default function TaskCard({ task, onCardClick, isDragOverlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  }

  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`task-card animate-pop ${isDragOverlay ? 'dragging' : ''}`}
      onClick={() => !isDragging && onCardClick(task)}
    >
      <div className="flex items-center justify-between mb-2">
        {task.priority && <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>}
        {task.deadline && <span className="text-[10px] text-muted ml-auto">📅 {task.deadline}</span>}
      </div>
      <h3 className="text-sm font-semibold text-slate-100 leading-snug mb-1">{task.title}</h3>
      {task.description && (
        <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-2">{task.description}</p>
      )}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
        </div>
      )}
      <div className="absolute top-2.5 right-2.5 opacity-20 hover:opacity-50 transition-opacity cursor-grab">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="3" cy="3" r="1.2"/><circle cx="9" cy="3" r="1.2"/>
          <circle cx="3" cy="6" r="1.2"/><circle cx="9" cy="6" r="1.2"/>
          <circle cx="3" cy="9" r="1.2"/><circle cx="9" cy="9" r="1.2"/>
        </svg>
      </div>
    </div>
  )
}
