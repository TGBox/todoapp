import React from 'react';

/*
	EFF for a single Todo element that can be used by the TodoList.
	- description: String that defines the name of the task.
	- done: Boolean state to indicate if the task is finished yet.
	- onChangeTodo: Reference to the EFF in TodoList that toggles the done state.
	- onDeleteTodo: Reference to the EFF in TodoList that deletes a single task at the specified index parameter.
	- onPriorityChange: Reference to the EFF in TodoList that raises or lowers the given task's priority.
	- index: Int to indicate the position and priority of the task within the task list.
*/
export const Todo = ({ description, done, onChangeTodo, onDeleteTodo, onPriorityChange, index }) => {

	return (
		<div>
			<div id={
				done ? "closed" : "open"
			}>
				<h2
					onClick={() => {
						onChangeTodo(index);
					}}
				>
					{description}
				</h2>
				<button 
					id="del"
					onClick={() => { onDeleteTodo(index) }}
				>Löschen</button>
				<button 
					onClick={() => { onPriorityChange(index, false) }}
					id="down"
				>↓</button>
				<button 
					id="up"
					onClick={() => { onPriorityChange(index, true) }}
				>↑</button>
				<div 
					id="deadline"
				></div>
			</div>
		</div>
	);
};
