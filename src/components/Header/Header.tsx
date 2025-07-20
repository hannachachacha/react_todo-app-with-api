import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleEmptyTitle: (message: string) => void;
  handleNewTitle: (newTitle: string) => Promise<boolean>;
  isLoading: boolean;
  handleMarkAllCompleted: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  handleEmptyTitle,
  handleNewTitle,
  isLoading,
  handleMarkAllCompleted,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = input.trim();

    if (!newTitle) {
      handleEmptyTitle('Title should not be empty');

      return;
    }

    const success = await handleNewTitle(newTitle);

    if (success) {
      setInput('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleMarkAllCompleted}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
