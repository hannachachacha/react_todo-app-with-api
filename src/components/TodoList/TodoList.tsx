/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  updateTodoData: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  deleteTodo,
  deletingTodoIds,
  updatingTodoIds,
  updateTodoData,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  function handleFinishEditing(
    /* eslint-disable-next-line */
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement> | null,
    toDoID: number,
  ) {
    e?.preventDefault();

    if (!editingTitle.trim()) {
      deleteTodo(toDoID);
      setEditingTodoId(null);

      return;
    }

    updateTodoData(toDoID, { title: editingTitle.trim() });
    setEditingTodoId(null);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {[...todos, tempTodo]
        .filter((todo): todo is Todo => todo !== null)
        .filter((todo: Todo) => {
          if (filter === 'active') {
            return !todo.completed;
          }

          if (filter === 'completed') {
            return todo.completed;
          }

          return true;
        })
        .map(todo => {
          const checkboxId = `todo-status-${todo.id}`;

          return (
            <div
              data-cy="Todo"
              className={`todo${todo.completed ? ' completed' : ''}`}
              key={todo.id}
            >
              <label className="todo__status-label" htmlFor={checkboxId}>
                <input
                  id={checkboxId}
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() =>
                    updateTodoData(todo.id, { completed: !todo.completed })
                  }
                />
              </label>
              {todo.id === editingTodoId ? (
                <form onSubmit={e => handleFinishEditing(e, todo.id)}>
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onKeyUp={e => e.key === 'Escape' && setEditingTodoId(null)}
                    onBlur={e => handleFinishEditing(e, todo.id)}
                    autoFocus
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    setEditingTodoId(todo.id);
                    setEditingTitle(todo.title);
                  }}
                >
                  {todo.title}
                </span>
              )}
              {/* Remove button appears only on hover */}
              {todo.id !== editingTodoId && (
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>
              )}

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active':
                    todo.id === 0 ||
                    deletingTodoIds.includes(todo.id) ||
                    updatingTodoIds.includes(todo.id),
                })}
              >
                {/* eslint-disable-next-line */}
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        })}
    </section>
  );
};
