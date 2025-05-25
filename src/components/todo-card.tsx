import { useState } from 'react'
import { TodoDTO } from '@/types/todo-dto'
import {
  CheckCircle,
  Circle,
  Trash,
  PencilSimple,
  FloppyDisk,
} from 'phosphor-react'

interface Props {
  todo: TodoDTO
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, newDescription: string) => void
}

export function TodoCard({ todo, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(todo.description)

  const handleSave = () => {
    if (!description.trim()) {
      return
    }
    onEdit(todo.id, description)
    setIsEditing(false)
  }

  const isDisabled = todo.isCompleted

  return (
    <div
      className={`flex items-start gap-3 p-4 bg-zinc-800 rounded shadow text-sm ${
        todo.isCompleted ? 'opacity-50 line-through text-zinc-400' : ''
      }`}
    >
      <button onClick={() => onToggle(todo.id)} className="mt-1">
        {todo.isCompleted ? (
          <CheckCircle className="text-indigo-400" weight="fill" />
        ) : (
          <Circle className="text-sky-400" weight="regular" />
        )}
      </button>

      {isEditing ? (
        <input
          className="flex-grow bg-zinc-700 text-white px-2 py-1 rounded border border-zinc-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isDisabled}
        />
      ) : (
        <span className="flex-grow">{todo.description}</span>
      )}

      {isEditing ? (
        <button onClick={handleSave} disabled={isDisabled}>
          <FloppyDisk
            className={`${
              isDisabled
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-green-400 hover:text-green-500'
            }`}
          />
        </button>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          disabled={isDisabled}
        >
          <PencilSimple
            className={`${
              isDisabled
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-400 hover:text-yellow-400'
            }`}
          />
        </button>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        disabled={isDisabled}
      >
        <Trash
          className={`${
            isDisabled
              ? 'text-zinc-600 cursor-not-allowed'
              : 'text-zinc-500 hover:text-red-500'
          }`}
        />
      </button>
    </div>
  )
}
