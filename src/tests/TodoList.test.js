import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Todo } from "../components/Todo";
import { TodoList } from "../components/TodoList";
import { unmountComponentAtNode } from "react-dom";

let container = null;
let confirmSpy = null;
let alertConfirmSpy = null;

// Will automatically confirm any confirm and alert windows that pop up during testing.
beforeAll(() => {
  confirmSpy = jest.spyOn(window, "confirm");
  confirmSpy.mockImplementation(jest.fn(() => true));
  alertConfirmSpy = jest.spyOn(window, "alert");
  alertConfirmSpy.mockImplementation(jest.fn(() => true));
});

// Will reset the confirmSpy and alertConfirmSpy to avoid unwanted side effects.
afterAll(() => {
  confirmSpy.mockRestore()
  alertConfirmSpy.mockRestore();
});

// Will generate the container DOM element to enable isolated tests.
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

// Will remove and reset the container for the next test to avoid leaky behaviour.
afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

// Mock-up of the TodoList component for further testing.
const MockTodoList = () => {
  return (
    <TodoList></TodoList>
  );
};

// Helper method to simulate the user input for adding one or multiple tasks as an array.
const addTask = (tasks) => {
  const textInputElement = screen.getByTestId("taskNameInput");
  const addButtonElement = screen.getByTestId("submitButton");
  tasks.forEach((task) => {
    fireEvent.change(textInputElement, { target: { value: task } });
    fireEvent.click(addButtonElement);
  });
};

// Helper method to simulate the user input for adding one task with a deadline.
const addTaskWithDeadline = (task, deadline) => {
  const textInputElement = screen.getByTestId("taskNameInput");
  const addButtonElement = screen.getByTestId("submitButton");
  const dateInputElement = screen.getByTestId("dateInput");
  fireEvent.change(textInputElement, { target: { value: task } });
  fireEvent.change(dateInputElement, { target: { value: deadline } });
  fireEvent.click(addButtonElement);
};

// Helper method to simulate the toggle of a specified task via user input.
const toggleTaskDoneState = (taskName) => {
  const taskHeading = screen.getByText(taskName);
  fireEvent.click(taskHeading);
};

// Helper method to simulate a click on the remove done button via user input.
const removeAllDoneTasks = () => {
  const removeAllDoneButton = screen.getByTestId("removeDone");
  fireEvent.click(removeAllDoneButton);
};

// Helper method to simulate a click on the remove all button via user input.
const removeAllTasks = () => {
  const removeAllButton = screen.getByText("Alle Tasks entfernen");
  fireEvent.click(removeAllButton);
};

test("Input of a single task via user interaction. Check if it gets displayed.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Aufräumen"]);
  const divElement = screen.getByText(/aufräumen/i);
  expect(divElement).toBeInTheDocument();
});

test("Input of multiple tasks via user interaction. Check if all of them get displayed.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Einkaufen gehen", "Sport", "programmieren"]);
  const divElements = [];
  divElements.push(screen.getByText(/einkaufen gehen/i));
  divElements.push(screen.getByText(/sport/i));
  divElements.push(screen.getByText(/programmieren/i));
  expect(divElements.length).toBe(3);
});

test("Input of multiple tasks with the same name via user interaction.\nCheck for only one being accepted.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Yoga", "Yoga"]);
  const divElements = screen.queryAllByText(/yoga/i);
  expect(divElements.length).toBe(1);
});

test("Input of multiple tasks with the same name via user interaction.\nCheck for matching alert.", async () => {
  render(
    <MockTodoList />,
    container
  );
  const alertSpy = jest.spyOn(window, "alert").mockImplementation();
  addTask(["Reiten", "Reiten"]);
  expect(alertSpy).toHaveBeenCalledWith("Das Todo steht bereits auf der Liste.\nDaher wurde es nicht hinzugefügt.");
});

test("Input of single task with description that surpasses the limit.\nCheck for matching alert.", async () => {
  render(
    <MockTodoList />,
    container
  );
  const alertSpy = jest.spyOn(window, "alert").mockImplementation();
  addTask(["abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"]);
  expect(alertSpy).toHaveBeenCalledWith("Die maximale Länge eines Todos ist 100 Zeichen.\nBitte versuche es erneut!");
});

test("Input of a single task with a deadline via user interaction.\nCheck if it gets displayed.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTaskWithDeadline("Lesen", "2022-06-08");
  const divDescriptionElement = screen.getByText(/lesen/i);
  const divDeadlineElement = screen.getByText("2022-06-08");
  expect(divDescriptionElement).toBeInTheDocument();
  expect(divDeadlineElement).toBeInTheDocument();
});

test("Check if tasks can be toggled via user click as intended.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Fußball"]);
  const divDescriptionElement = screen.getByText(/fußball/i);
  expect(divDescriptionElement).toBeInTheDocument();
  toggleTaskDoneState("Fußball");
  expect(divDescriptionElement).toBeInTheDocument();
});

test("Check if all done tasks get removed when the remove done button gets pressed.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Fußball", "Schach spielen", "Fernsehen"]);
  let divDescriptionElement = screen.getByText(/fußball/i);
  expect(divDescriptionElement).toBeInTheDocument();
  divDescriptionElement = screen.getByText(/schach spielen/i);
  expect(divDescriptionElement).toBeInTheDocument();
  divDescriptionElement = screen.getByText(/fernsehen/i);
  expect(divDescriptionElement).toBeInTheDocument();
  let tasks = screen.queryAllByTestId("descriptionDiv");
  const amountBefore = tasks.length;
  toggleTaskDoneState("Fußball");
  toggleTaskDoneState("Fernsehen");
  removeAllDoneTasks();
  tasks = screen.queryAllByTestId("descriptionDiv");
  const amountAfter = tasks.length;
  expect(amountBefore).toBeGreaterThan(amountAfter);
});

test("Check if all tasks can be removed at once via user input.", async () => {
  render(
    <MockTodoList />,
    container
  );
  window.confirm = jest.fn(() => true);
  let tasksBefore = screen.queryAllByTestId("descriptionDiv");
  const amountBefore = tasksBefore.length;
  removeAllTasks();
  let tasksAfter = screen.queryAllByTestId("descriptionDiv");
  const amountAfter = tasksAfter.length;
  expect(amountBefore).toBeGreaterThan(amountAfter);
  expect(amountAfter).toBe(0);
});

