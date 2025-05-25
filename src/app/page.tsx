'use client'

import { useEffect, useState } from 'react'
import { TodoDTO } from '@/types/todo-dto'
import { TodoCard } from '@/components/todo-card'

export default function Page() {
  const [tasks, setTasks] = useState<TodoDTO[]>([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetch('http://localhost:3333/todos')
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  const handleCreate = async () => {
    if (!newTask.trim()) return

    const response = await fetch('http://localhost:3333/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newTask }),
    })

    const created: TodoDTO = await response.json()
    setTasks([created, ...tasks])
    setNewTask('')
  }

  const handleToggle = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const response = await fetch(`http://localhost:3333/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isCompleted: !task.isCompleted,
      }),
    })

    const updated = await response.json()
    setTasks(tasks.map(t => t.id === id ? updated : t))
  }

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3333/todos/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleEdit = async (id: number, newDescription: string) => {
    const response = await fetch(`http://localhost:3333/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: newDescription,
      }),
    })

    const updated = await response.json()
    setTasks(tasks.map(t => t.id === id ? updated : t))
  }

  const doneTasks = tasks.filter(t => t.isCompleted).length

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <span className="text-sky-400">🚀</span> <span className="text-indigo-400">todo</span>
      </h1>

      <div className="flex mt-6 w-full max-w-2xl">
        <input
          type="text"
          placeholder="Adicione uma nova tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l bg-zinc-800 text-white border border-zinc-600"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-r"
        >
          Criar
        </button>
      </div>

      <div className="flex justify-between w-full max-w-2xl mt-8 text-sm text-zinc-300">
        <span className="text-sky-400 font-bold">
          Tarefas criadas <span className="ml-1 bg-zinc-700 px-2 py-0.5 rounded-full text-white">{tasks.length}</span>
        </span>
        <span className="text-indigo-400 font-bold">
          Concluídas <span className="ml-1 bg-zinc-700 px-2 py-0.5 rounded-full text-white">{doneTasks} de {tasks.length}</span>
        </span>
      </div>

      <div className="mt-4 w-full max-w-2xl flex flex-col gap-2">
        {tasks.map(task => (
          <TodoCard
            key={task.id}
            todo={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </main>
  )
}
