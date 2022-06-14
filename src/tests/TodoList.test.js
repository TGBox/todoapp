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

// Helper method to simulate a click on the sort by name button via user input.
const sortTasksByName = () => {
  const sortByNameButton = screen.getByTestId("sortName");
  fireEvent.click(sortByNameButton);
};

// Helper method to simulate a click on the sort by done button via user input.
const sortTasksByDone = () => {
  const sortByDoneButton = screen.getByTestId("sortDone");
  fireEvent.click(sortByDoneButton);
};


// Helper method to simulate a click on the sort by deadline button via user input.
const sortTasksByDate = () => {
  const sortByDateButton = screen.getByTestId("sortDate");
  fireEvent.click(sortByDateButton);
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

test("Input of multiple tasks with the same name via user interaction. Check for only one being accepted.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Yoga", "Yoga"]);
  const divElements = screen.queryAllByText(/yoga/i);
  expect(divElements.length).toBe(1);
});

test("Input of multiple tasks with the same name via user interaction. Check for matching alert.", async () => {
  render(
    <MockTodoList />,
    container
  );
  const alertSpy = jest.spyOn(window, "alert").mockImplementation();
  addTask(["Reiten", "Reiten"]);
  expect(alertSpy).toHaveBeenCalledWith("Das Todo steht bereits auf der Liste.\nDaher wurde es nicht hinzugefügt.");
});

test("Input of single task with description that surpasses the limit. Check for matching alert.", async () => {
  render(
    <MockTodoList />,
    container
  );
  const alertSpy = jest.spyOn(window, "alert").mockImplementation();
  addTask(["abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"]);
  expect(alertSpy).toHaveBeenCalledWith("Die maximale Länge eines Todos ist 100 Zeichen.\nBitte versuche es erneut!");
});

test("Input of a single task with a deadline via user interaction. Check if it gets displayed.", () => {
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

test("Check if sorting tasks by name via user input is working correctly.", () => {
  render(
    <MockTodoList />,
    container
  );
  addTask(["Lernen", "Backen", "Trainieren", "Abspülen"]);
  sortTasksByName();
  let tasks = screen.queryAllByTestId("descriptionHeading");
  const length = tasks.length;
  expect(length).toBe(4);
  expect(tasks[0]).toHaveTextContent("Abspülen");
  expect(tasks[1]).toHaveTextContent("Backen");
  expect(tasks[2]).toHaveTextContent("Lernen");
  expect(tasks[3]).toHaveTextContent("Trainieren");
});

test("Check if sorting tasks by date via user input is working correctly.", async () => {
  render(
    <MockTodoList />,
    container
  );
  window.confirm = jest.fn(() => true);
  removeAllTasks();
  addTaskWithDeadline("Task 1", "2023-06-06");
  addTaskWithDeadline("Task 2", "2022-01-01");
  addTaskWithDeadline("Task 3", "2022-12-12");
  addTaskWithDeadline("Task 4", "2021-01-01");
  sortTasksByDate();
  let tasks = screen.queryAllByTestId("descriptionHeading");
  const length = tasks.length;
  expect(length).toBe(4);
  expect(tasks[0]).toHaveTextContent("Task 4");
  expect(tasks[1]).toHaveTextContent("Task 2");
  expect(tasks[2]).toHaveTextContent("Task 3");
  expect(tasks[3]).toHaveTextContent("Task 1");
});

test("Check if sorting tasks by done state via user input is working correctly.", () => {
  render(
    <MockTodoList />,
    container
  );
  window.confirm = jest.fn(() => true);
  removeAllTasks();
  addTask(["Task 1", "Task 2", "Task 3", "Task 4"]);
  let tasks = screen.queryAllByTestId("descriptionHeading");
  let length = tasks.length;
  expect(length).toBe(4);
  toggleTaskDoneState("Task 1");
  toggleTaskDoneState("Task 3");
  sortTasksByDone();
  tasks = screen.queryAllByTestId("descriptionHeading");
  expect(tasks[0]).toHaveTextContent("Task 2");
  expect(tasks[1]).toHaveTextContent("Task 4");
  expect(tasks[2]).toHaveTextContent("Task 1");
  expect(tasks[3]).toHaveTextContent("Task 3");
});
