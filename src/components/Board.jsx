import React, { useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTasks } from '../context/TaskContext'
import Column from './Column'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import AddTaskModal from './AddTaskModal'

const COLUMNS = [
  { id: 'todo',       label: 'To Do',      color: '#a5b4fc', count_color: 'bg-indigo-500/20 text-indigo-300' },
  { id: 'inprogress', label: 'In Progress', color: '#fbbf24', count_color: 'bg-amber-500/20  text-amber-300'  },
  { id: 'done',       label: 'Done',        color: '#34d399', count_color: 'bg-emerald-500/20 text-emerald-300'},
]

export default function Board() {
  const { state, moveTask } = useTasks()
  const [activeTask, setActiveTask]       = useState(null)
  const [viewTask, setViewTask]           = useState(null)
  const [showAddModal, setShowAddModal]   = useState(false)
  const [defaultStatus, setDefaultStatus] = useState('todo')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart(event) {
    for (const col of Object.values(state)) {
      const found = col.find(t => t.id === event.active.id)
      if (found) { setActiveTask(found); break }
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    let overCol = null
    if (COLUMNS.find(c => c.id === over.id)) {
      overCol = over.id
    } else {
      for (const [col, tasks] of Object.entries(state)) {
        if (tasks.find(t => t.id === over.id)) { overCol = col; break }
      }
    }
    if (!overCol) return
    moveTask({ activeId: active.id, overCol, overTaskId: COLUMNS.find(c => c.id === over.id) ? null : over.id })
  }

  function openAdd(status = 'todo') { setDefaultStatus(status); setShowAddModal(true) }

  const total = Object.values(state).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5 flex items-center justify-between border-b border-surface-border">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text tracking-tight">TaskFlow</h1>
          <p className="text-muted text-xs mt-0.5">{total} tasks across {COLUMNS.length} stages</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => openAdd('todo')}>
          <span className="text-lg leading-none">+</span> New Task
        </button>
      </header>

      <main className="flex-1 flex gap-5 px-6 py-6 overflow-x-auto pb-10">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {COLUMNS.map(col => (
            <Column
              key={col.id} colId={col.id} label={col.label}
              color={col.color} countColor={col.count_color}
              tasks={state[col.id]} onCardClick={setViewTask}
              onAddClick={() => openAdd(col.id)}
            />
          ))}
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onCardClick={() => {}} isDragOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      {viewTask    && <TaskModal task={viewTask} onClose={() => setViewTask(null)} />}
      {showAddModal && <AddTaskModal defaultStatus={defaultStatus} onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
