import React, { useState, useEffect } from 'react'
import { useTasks } from '../context/TaskContext'

const PRIORITIES = ['low', 'medium', 'high']
const STATUSES   = [
  { id: 'todo', label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export default function TaskModal({ task, onClose }) {
  const { editTask, deleteTask } = useTasks()
  const [form, setForm]     = useState({ ...task })
  const [editing, setEditing] = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => { setForm({ ...task }); setEditing(false) }, [task])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSave() { editTask(form); setEditing(false); onClose() }

  function handleDelete() {
    if (window.confirm('Delete this task? This cannot be undone.')) { deleteTask(task.id); onClose() }
  }

  function handleAddTag(e) {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!form.tags.includes(newTag)) setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setTagInput('')
    }
  }

  function removeTag(i) { setForm(prev => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) })) }
  function handleOverlayClick(e) { if (e.target === e.currentTarget) onClose() }

  const badgeMap = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 mr-4">
            {form.priority && <span className={`badge ${badgeMap[form.priority]} mb-2 inline-block`}>{form.priority} priority</span>}
            {editing
              ? <input name="title" value={form.title} onChange={handleChange} className="form-input text-base font-semibold" placeholder="Task title" />
              : <h2 className="font-display text-lg font-bold text-white">{form.title}</h2>
            }
          </div>
          <button onClick={onClose} className="btn-ghost text-xl leading-none flex-shrink-0">✕</button>
        </div>

        <div className="mb-4">
          <label className="form-label">Description</label>
          {editing
            ? <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="form-input resize-none" placeholder="Add a description..." />
            : <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[40px]">
                {form.description || <span className="text-muted">No description.</span>}
              </p>
          }
        </div>

        {editing && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-input">
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="form-input">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>
        )}

        {editing && (
          <div className="mb-4">
            <label className="form-label">Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="form-input" />
          </div>
        )}

        <div className="mb-5">
          <label className="form-label">Tags</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.tags.map((tag, i) => (
              <span key={i} className="tag flex items-center gap-1">
                #{tag}
                {editing && <button onClick={() => removeTag(i)} className="hover:text-red-400 ml-0.5">×</button>}
              </span>
            ))}
            {form.tags.length === 0 && !editing && <span className="text-muted text-xs">No tags</span>}
          </div>
          {editing && (
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag}
              className="form-input text-xs" placeholder="Type a tag and press Enter…" />
          )}
        </div>

        {!editing && form.deadline && <p className="text-xs text-muted mb-5">📅 Due: {form.deadline}</p>}

        <div className="flex items-center justify-between border-t border-surface-border pt-4">
          <button onClick={handleDelete} className="btn-danger">🗑 Delete</button>
          <div className="flex gap-2">
            {editing
              ? <><button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                  <button onClick={handleSave} className="btn-primary">Save Changes</button></>
              : <button onClick={() => setEditing(true)} className="btn-primary">✏ Edit</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
