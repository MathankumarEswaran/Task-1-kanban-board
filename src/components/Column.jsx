import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

export default function Column({ colId, label, color, countColor, tasks, onCardClick, onAddClick }) {
  const { setNodeRef, isOver } = useDroppable({ id: colId })

  return (
    <div ref={setNodeRef} className={`column transition-all duration-200 ${isOver ? 'drag-over' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          <h2 className="column-title" style={{ color }}>{label}</h2>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${countColor}`}>{tasks.length}</span>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 min-h-[60px]">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onCardClick={onCardClick} />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={onAddClick}
        className="mt-4 w-full text-xs text-muted hover:text-slate-300 py-2 rounded-xl
                   border border-dashed border-surface-border hover:border-slate-500
                   transition-all duration-150 flex items-center justify-center gap-1.5"
      >
        <span className="text-base leading-none">+</span> Add task
      </button>
    </div>
  )
}
