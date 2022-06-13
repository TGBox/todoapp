import React from 'react';
import { Todo } from './Todo';
import { useState, useEffect } from 'react';

// Equivalent to a class. Export can be inlined directly or added at the end.
export const TodoList = () => {

	// Initializing of the count variable to see the amount of tasks in the list. Default value 0.
	const [openCount, countOpenTodos] = useState(0);


	// Initializing of the task array with usage of the local storage. If none is existent, use empty array.
	const [todos, setTodos] = useState(() => {
		const items = localStorage.getItem("items");
		const parsed = JSON.parse(items);
		return parsed || [];
	});

	// Initializing of the text for the text input field. Empty String as default value.
	const [textInput, setTextInput] = useState("");

	// Initializing the String that is used for the deadline date picker. Empty by default.
	const [deadlineInput, setDate] = useState("");

	// Equivalent for function (EFF) to change the text of the input field on key event.
	const changeText = (e) => {
		setTextInput(e.target.value);
	};

	// EFF to change the date String that is read from the datepicker.
	const changeDate = (e) => {
		setDate(e.target.value);
	};

	// EFF to submit a new task using the String from the input text field.
	const submitTodo = (e) => {
		// Prevents the default page refresh behaviour.
		e.preventDefault();
		// Prevents adding of empty, too long or duplicate tasks.
		if((textInput !== "") && (textInput.length <= 100) && (checkForDuplicate(textInput) === -1)){
			if(deadlineInput === "") {
				// Important! Always create new data as to not change behaviour at other places. (Important new!)
				const newTodos = [...todos, { description: textInput, done: false, deadline: "" }];
				setTodos(newTodos);
			} else {
				// Important new!
				const newTodos = [...todos, { description: textInput, done: false, deadline: deadlineInput}];
				setTodos(newTodos);
			}
		} else if(textInput.length > 100) {
			alert("Die maximale Länge eines Todos ist 100 Zeichen.\nBitte versuche es erneut!");
		} else if(checkForDuplicate(textInput) !== -1) {
			alert("Das Todo steht bereits auf der Liste.\nDaher wurde es nicht hinzugefügt.");
		}
		setTextInput("");
		document.getElementById("date").value = "";
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
			return -1;
		  } else if (taskA.description > taskB.description){
			return 1;
		  } else {
			  return 0;
		  }
	};

	/*
		EFF to compare two Tasks by their respective deadline Strings.
		- taskA: First Todo.
		- taskB: Second Todo.
	*/
	const compareTasksByDate = (taskA, taskB) => {	
		if (taskA.deadline === "" && taskB.deadline !== "") {
			return 1;
		} else if (taskB.deadline === "" && taskA.deadline !== "") {
			return -1;
		} else {
			if (taskA.deadline < taskB.deadline){
				return -1;
			} else if (taskA.deadline > taskB.deadline){
				return 1;
			}
		}
		return 0;
	};

	/*
		EFF to validate the deadline String against the current date to indicate if it has passed it's deadline.
	*/
	const checkForDueDate = (deadline) => {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = yyyy + "-" + mm + "-" + dd;
		if(deadline <= today && deadline !== "") {
			return true;
		} else {
			return false;
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
		EFF to sort the task list so that the most urgent tasks will be at the front.
	*/
	const sortTasksByDate = () => {
		// Important new!
		const newTodos = [...todos];
		newTodos.sort(compareTasksByDate);
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

	/*
		EFF to remove all finished tasks from the list.
	*/
	const removeFinishedTasks = () => {
		// Important new!
		const newTodos = [...todos];
		const justUnfinishedTodos = newTodos.filter(function(task) {
			return !(task.done);
		});
		setTodos(justUnfinishedTodos);
	};

	// Will get triggered when all tasks should be removed. Prompts user to confirm his choice. 
	const removeAllTasks = () => {
		if(openCount !== 0) {
			if(window.confirm("Wollen Sie wirklich alle Tasks entfernen?\nEs befinden sich noch " + openCount + 
				" unerledigte Tasks in der Liste.\n\nAktion kann nicht rückgängig gemacht werden!")) {
				setTodos([]);
			}
		} else {
			alert("Keine Tasks zum Löschen vorhanden!");
		}
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

	// Important! React always expects a return of a singular HTML item.
	return (
		<div>
			<div id="head">
				<div id="title">
					<h1>Danis React To-Do App</h1>
					<h4>{openCount !== 0 ? "Noch zu erledigen: " + openCount : "Keine offenen Tasks mehr!"}</h4>
				</div>
				<div id="metaButtons">
					<button 
						id="removeAll"
						onClick={removeAllTasks}
					>Alle Tasks entfernen</button>
					<button 
						id="removeDone"
						onClick={removeFinishedTasks}
					>Alle fertigen Tasks entfernen</button>
					<button 
						id="sortDone"
						onClick={sortTasksByDone}
					>Sortieren nach Erledigt</button>
					<button 
						id="sortDate"
						onClick={sortTasksByDate}
					>Sortieren nach Deadline</button>
					<button 
						id="sortName"
						onClick={sortTasksByDescription}
					>Alphabetisch Sortieren</button>
				</div>
				<form>
					<input
						data-testid="taskNameInput"
						name="taskName"
						id="taskName"
						type="text"
						placeholder="Neues Todo..."
						value={
							textInput
						}
						onChange={changeText}
					></input>
					<input 
						data-testid={"dateInput"}
						type="date" 
						id="date"
						onChange={changeDate}
					></input>
					<input 
						data-testid={"submitButton"}
						type="submit" 
						value="Hinzufügen" 
						onClick={submitTodo}
					></input>
				</form>
			</div>

			{todos.map((item, index) => {
				return (
					<Todo
						description={item.description}
						done={item.done}
						deadline={item.deadline}
						due={checkForDueDate(item.deadline)}
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