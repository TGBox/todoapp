import React from 'react';
import { Todo } from './Todo';
import { useState, useEffect } from 'react';

// Equivalent to a class. Export can be inlined directly or added at the end.
export const TodoList = () => {

	// Initializing of the count variable to see the amount of tasks in the list. Default value 0.
	const [openCount, countOpenTodos] = useState(0);

	// Initializing of the task array with usage of the local storage. If none is existent, use empty array.
	const [todos, setTodos] = useState(() => {
		console.log(localStorage.getItem("items"));
		const items = localStorage.getItem("items");
		const parsed = JSON.parse(items);
		return parsed || [];
	});

	// Initializing of the text for the text input field. Empty String as default value.
	const [textInput, setTextInput] = useState("");

	// Equivalent for function (EFF) to change the text of the input field on key event.
	const changeText = (e) => {
		setTextInput(e.target.value);
	};

	// EFF to submit a new task using the String from the input text field.
	const submitTodo = (e) => {
		// Prevents the default page refresh behaviour.
		e.preventDefault();
		// Prevents adding of empty tasks and of too lenghty tasks.
		if((textInput !== "") && (textInput.length <= 100)){
			// Important! Always create new data as to not change behaviour at other places. (Important new!)
			const newTodos = [...todos, { description: textInput, done: false }];
			setTodos(newTodos);
		} else if(textInput.length > 100) {
			alert("Die maximale Länge eines Todos ist 100 Zeichen.\nBitte versuche es erneut!");
		}
		setTextInput("");
	};

	// EFF for toggeling the done status of the task at the specified index within the task list.
	const changeTodo = (index) => {
		// Important new!
		const newTodos = [...todos];
		if (newTodos[index].done) {
			newTodos[index].done = false;
		} else {
			newTodos[index].done = true;
		}
		setTodos(newTodos);
	};

	// EFF to delete the task at the specified index.
	const deleteTodo = (index) => {
		// Important new!
		const newTodos = [...todos];
		newTodos.splice(index, 1);
		setTodos(newTodos);
	};

	/* 
		EFF for changing the priority of the selected task at the specified index.
		- index: Int index of the task to change.
		- raise: Boolean true if it should be raised, false if it needs to be lowered. 
	*/
	const changePriority = (index, raise) => {
		// Important new!
		const newTodos = [...todos];
		var task = newTodos[index];
		newTodos.splice(index, 1);
		if(raise) {
			newTodos.splice(index-1, 0, task);
		} else {
			newTodos.splice(index+1, 0, task);
		}
		setTodos(newTodos);
	};

	// React specific way to perform side effects in react components without the need for a class.
	useEffect(() => {

		// EFF to count the amount of not finished tasks in the task list.
		const countOpen = () => {
			const finishedTodos = todos.filter((item) => {
				return !item.done;
			});
			countOpenTodos(finishedTodos.length);
		};

		countOpen();
		// Saving the current list inside the local storage of the browser.
		localStorage.setItem("items", JSON.stringify(todos));
	}, [todos]);

	// Important! React always expects a return of a singular div HTML item.
	return (
		<div>
			<div id="head">
				<h1>Unsere Todos</h1>
				<h4>Noch zu erledigen: {openCount}</h4>
				<form>
					<input
						type="text"
						placeholder="Neues Todo..."
						value={
							textInput
						}
						onChange={changeText}
					></input>
					<input type="submit" value="Hinzufügen" onClick={submitTodo}></input>
				</form>
			</div>

			{todos.map((item, index) => {
				return (
					<Todo
						description={item.description}
						done={item.done}
						key={index}
						index={index}
						onChangeTodo={changeTodo}
						onDeleteTodo={deleteTodo}
						onPriorityChange={changePriority}
					></Todo>
				)
			})}
		</div>
	);
}
