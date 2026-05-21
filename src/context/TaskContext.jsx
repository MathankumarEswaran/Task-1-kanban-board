import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const INITIAL_TASKS = {
  todo: [
    { id: uuidv4(), title: 'Design wireframes', description: 'Create low-fidelity wireframes for all screens.', priority: 'high', status: 'todo' },
    { id: uuidv4(), title: 'Set up project repo', description: 'Initialize GitHub repo with README and folder structure.', priority: 'medium', tags: ['setup'], status: 'todo' },
  ],
  inprogress: [
    { id: uuidv4(), title: 'Build Kanban board', description: 'Implement drag-and-drop task board with React.', priority: 'high', tags: ['react', 'frontend'], status: 'inprogress' },
  ],
  done: [
    { id: uuidv4(), title: 'Project kickoff meeting', description: 'Align on goals, scope, and timeline.', priority: 'low', tags: ['planning'], deadline: '', status: 'done' },
  ],
}

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK': {
      const { task } = action.payload
      return { ...state, [task.status]: [...state[task.status], task] }
    }
    case 'EDIT_TASK': {
      const { updatedTask } = action.payload
      const newState = { ...state }
      for (const col of Object.keys(newState)) {
        const idx = newState[col].findIndex(t => t.id === updatedTask.id)
        if (idx !== -1) {
          newState[col] = [...newState[col]]
          if (updatedTask.status !== col) {
            newState[col].splice(idx, 1)
            newState[updatedTask.status] = [...newState[updatedTask.status], updatedTask]
          } else {
            newState[col][idx] = updatedTask
          }
          break
        }
      }
      return newState
    }
    case 'DELETE_TASK': {
      const { id } = action.payload
      const newState = { ...state }
      for (const col of Object.keys(newState)) {
        newState[col] = newState[col].filter(t => t.id !== id)
      }
      return newState
    }
    case 'MOVE_TASK': {
      const { activeId, overCol, overTaskId } = action.payload
      const newState = { ...state }
      let movedTask = null
      for (const col of Object.keys(newState)) {
        const idx = newState[col].findIndex(t => t.id === activeId)
        if (idx !== -1) {
          movedTask = { ...newState[col][idx], status: overCol }
          newState[col] = newState[col].filter(t => t.id !== activeId)
          break
        }
      }
      if (!movedTask) return state
      if (overTaskId && overTaskId !== activeId) {
        const overIdx = newState[overCol].findIndex(t => t.id === overTaskId)
        newState[overCol] = [...newState[overCol].slice(0, overIdx), movedTask, ...newState[overCol].slice(overIdx)]
      } else {
        newState[overCol] = [...newState[overCol], movedTask]
      }
      return newState
    }
    default: return state
  }
}

const STORAGE_KEY = 'kanban_tasks_v1'
function loadFromStorage() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : INITIAL_TASKS }
  catch { return INITIAL_TASKS }
}
function saveToStorage(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
  catch { console.warn('localStorage unavailable') }
}

const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, null, loadFromStorage)
  useEffect(() => { saveToStorage(state) }, [state])

  const addTask    = (task)        => dispatch({ type: 'ADD_TASK',    payload: { task } })
  const editTask   = (updatedTask) => dispatch({ type: 'EDIT_TASK',   payload: { updatedTask } })
  const deleteTask = (id)          => dispatch({ type: 'DELETE_TASK', payload: { id } })
  const moveTask   = (payload)     => dispatch({ type: 'MOVE_TASK',   payload })

  return (
    <TaskContext.Provider value={{ state, addTask, editTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be inside TaskProvider')
  return ctx
}
