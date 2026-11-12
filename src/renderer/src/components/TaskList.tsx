import React, { useState } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
}

export default function TaskList(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newTask, setNewTask] = useState('')

  function openTask(): void {
    setIsOpen(true)
  }

  function addTask(): void {
    if (newTask.trim() === '') {
      return
    }

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: newTask,
        done: false
      }
    ])

    setNewTask('')
  }

  function toggleTask(id: number): void {
    setTasks(
      tasks.map((task) => {
        if (task.id !== id) {
          return task
        }

        return { ...task, done: !task.done }
      })
    )
  }

  function clearTask(): void {
    const updatedTasks = tasks.filter((task) => !task.done)

    setTasks(updatedTasks)
  }

  const hasFinishedTasks = tasks.some((task) => task.done)

  return (
    <div>
      <h2>Task</h2>

      <button
        onClick={openTask}
        title="Add task"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e26d6d]/50 text-[#e26d6d] hover:bg-[#e26d6d]/10 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      </button>

      {isOpen && (
        <div>
          <input
            type="text"
            id="new-todo"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTask()
              } else if (e.key === 'Escape') {
                setNewTask('')
                setIsOpen(false)
              }
            }}
          />
        </div>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
            <span className={task.done ? 'line-through text-gray-400' : ''}>{task.title}</span>
          </li>
        ))}
      </ul>

      <button onClick={clearTask} disabled={!hasFinishedTasks}>
        Clear finished
      </button>
    </div>
  )
}
