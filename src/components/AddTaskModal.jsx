import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTasks } from '../context/TaskContext'

const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]
const EMPTY = { title: '', description: '', priority: 'medium', tags: [], deadline: '', status: 'todo' }

export default function AddTaskModal({ defaultStatus, onClose }) {
  const { addTask } = useTasks()
  const [form, setForm]     = useState({ ...EMPTY, status: defaultStatus })
  const [tagInput, setTagInput] = useState('')
  const [error, setError]   = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'title') setError('')
  }

  function handleAddTag(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (newTag && !form.tags.includes(newTag)) setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setTagInput('')
    }
  }

  function removeTag(i) { setForm(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('Task title is required.'); return }
    addTask({ ...form, id: uuidv4(), title: form.title.trim() })
    onClose()
  }

  function handleOverlayClick(e) { if (e.target === e.currentTarget) onClose() }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold gradient-text">Create New Task</h2>
          <button onClick={onClose} className="btn-ghost text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="form-label">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} className="form-input"
              placeholder="What needs to be done?" autoFocus />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} className="form-input resize-none" placeholder="Optional details…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Column</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-input">
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Deadline (optional)</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" />
          </div>

          <div>
            <label className="form-label">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((tag, i) => (
                <span key={i} className="tag flex items-center gap-1">
                  #{tag}
                  <button type="button" onClick={() => removeTag(i)} className="hover:text-red-400">×</button>
                </span>
              ))}
            </div>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag}
              className="form-input text-xs" placeholder="Type a tag and press Enter…" />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  )
}
