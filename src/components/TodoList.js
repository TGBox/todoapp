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
		// Prevents adding of empty, too long or duplicate tasks.
		if((textInput !== "") && (textInput.length <= 100) && (checkForDuplicate(textInput) === -1)){
			// Important! Always create new data as to not change behaviour at other places. (Important new!)
			const newTodos = [...todos, { description: textInput, done: false }];
			setTodos(newTodos);
		} else if(textInput.length > 100) {
			alert("Die maximale Länge eines Todos ist 100 Zeichen.\nBitte versuche es erneut!");
		} else if(checkForDuplicate(textInput) !== -1) {
			alert("Das Todo steht bereits auf der Liste.\nDaher wurde es nicht hinzugefügt.");
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

	/* 
		EFF to check if a given task description is already part of our list.
		Returns either the index of the element or -1 if it isn't part of the list.
		- task: String description of the task.
	*/
	const checkForDuplicate = (task) => {
		var index = -1;
		for(var i = 0; i < todos.length; i++) {
	    	if (todos[i].description === task) {
            	index = i;
	        	break;
	    	}
		}
    	return index;
	};

	/*
		EFF to compare two Tasks by their respective done states to sort them.
		Will result in non-finished tasks being prioritised.
		- taskA: First Todo.
		- taskB: Second Todo.
	*/
	const compareTasksByDone = (taskA, taskB) => {
		if ( (taskA.done) && !(taskB.done) ){
			return 1;
		  } else if ( !(taskA.done) && (taskB.done) ){
			return -1;
		  } else {
			  return 0;
		  }
	};

	/*
		EFF to compare two Tasks by their respective descriptions Strings.
		- taskA: First Todo.
		- taskB: Second Todo.
	*/
	const compareTasksByName = (taskA, taskB) => {
		if (taskA.description < taskB.description){
			return 1;
		  } else if (taskA.description > taskB.description){
			return -1;
		  } else {
			  return 0;
		  }
	};

	/*
		EFF to sort the task list so that non-finished tasks will be at the front.
	*/
	const sortTasksByDone = () => {
		// Important new!
		const newTodos = [...todos];
		newTodos.sort(compareTasksByDone);
		setTodos(newTodos);
	};

	/*
		EFF to sort the task list alphabetically via their respective descriptions.
	*/
	const sortTasksByDescription = () => {
		// Important new!
		const newTodos = [...todos];
		newTodos.sort(compareTasksByName);
		setTodos(newTodos);
	};

	// React specific way to perform side effects in react components.
	useEffect(() => {

		/* 
			EFF to count the amount of not finished tasks in the task list.
			Needs to be inside of the useEffect because it isn't needed elsewhere.
		*/
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
				<div id="title">
					<h1>Danis React To-Do App</h1>
					<h4>Noch zu erledigen: {openCount}</h4>
				</div>
				<div id="metaButtons">
					<button 
						id="removeDone"
					>Alle fertigen Tasks entfernen</button>
					<button 
						id="sortDone"
						onClick={sortTasksByDone}
					>Sortieren nach Erledigt</button>
					<button 
						id="sortDate"
					>Sortieren nach Deadline</button>
				</div>
				<form>
					<input
						name="taskName"
						id="taskName"
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
