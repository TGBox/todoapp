import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Todo } from "../components/Todo";
import * as util from 'util' // has no default export
import { inspect } from 'util' // or directly

test("Render a mock todo and check for description match.", async () => {
  render(<Todo 
      description={"Testing mock todo."} 
      done={true} 
      onChangeTodo={null} 
      onDeleteTodo={null} 
      onPriorityChange={null} 
      index={0} 
      deadline={"12.06.2022"} 
      due={true} 
    />);
  const todoElement = screen.getByText(/testing mock todo./i);
  expect(todoElement).toBeInTheDocument();
});

test("Render a mock todo and check against non matching String.", async () => {
  render(<Todo 
      description={"Testing mock todo."} 
      done={false} 
      onChangeTodo={null} 
      onDeleteTodo={null} 
      onPriorityChange={null} 
      index={0} 
      deadline={"12.06.2022"} 
      due={true} 
    />);
  const todoElement = screen.queryByText(/not the right todo/i);
  expect(todoElement).not.toBeInTheDocument();
});
