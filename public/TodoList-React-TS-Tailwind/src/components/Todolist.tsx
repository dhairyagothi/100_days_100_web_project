import { useRef, useState, useEffect } from 'react'
import { FaCircleCheck, FaRegCircle } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { TbRepeatOff, TbRepeat } from "react-icons/tb";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import './TodolistItem.css'


type typeTodoListItem = {
    id: string;
    title: string;
    pinned: boolean;
    checked: boolean;
    recurring: boolean;
    tag: string;
}

function Todolist() {
    
    const inputRef = useRef<HTMLInputElement>(null);
    const tagRef = useRef<HTMLInputElement>(null);
    const [ todoTag, setTodoTag ] = useState<string>('personal');
    const [ todoFilter, setTodoFilter ] = useState<string>('all');
    const [ userTodoListItems, setUserTodoListItems ] = useState<typeTodoListItem[]>(JSON.parse(localStorage.getItem('TodoListItems') || '[]'));
    const [ todoTags, setTodoTags ] = useState<string[]>(JSON.parse(localStorage.getItem('userTodoTags') || '[\"personal\", \"work\"]'));

    const saveUserTodoListItems = (newData: typeTodoListItem[]) => {
        localStorage.setItem('TodoListItems', JSON.stringify(newData));
        setUserTodoListItems(newData);
    };
    
    const saveUserTodoTags = (newData: string[]) => {
        localStorage.setItem('userTodoTags', JSON.stringify(newData));
        setTodoTags(newData);
    };

	let TodoListItems: typeTodoListItem[] = [
		...userTodoListItems
	];

	// Utility function to sanitize input
	const sanitizeInput = (input: string): string => {
		const div = document.createElement("div");
		div.textContent = input;
		return div.innerHTML;
	};

	// Create todo item DOM (React JSX)
	const createTodoItem = (todo: typeTodoListItem) => {
		return (
            <div className={`p-2 bg-slate-300 dark:bg-slate-700 max-w-screen-sm w-full rounded-2xl hover:scale-105 max-md:scale-90 max-md:hover:scale-90 transition-all duration-300 ${todo.checked ? "dark:bg-slate-900 bg-slate-200" : ""}`} key={todo.id} 
			onClick={() => {
				toggleTodoStatus(todo.id, "checked");
			}}>
                <div className='flex relative'>
                    <div className={`p-2 bg-transparent break-words w-full font-medium ${todo.checked ? "line-through decoration-2" : ""}`}>
                        {sanitizeInput(todo.title)}
                    </div>
                </div>
                <div className='flex gap-2 p-2 justify-between'>
                    <div className='flex gap-2'>
                        <span>Tags &rarr; </span>
                        <label className='px-3 py-0.5 max-w-[110px] text-ellipsis overflow-hidden rounded-full bg-blue-600 dark:bg-red-500 text-slate-50' >
                            {todo.tag}
                        </label>
                    </div>
                    <div className='TodoIcons flex gap-4 justify-center items-center'>
                        <div className='p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer'>
                            { todo.checked ? <FaCircleCheck /> : <FaRegCircle />}
                        </div>

                        <div
                            className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTodoStatus(todo.id, "pinned");
                            }}
                        >
                            { todo.pinned ? <BsPinAngleFill /> : <BsPinAngle />}
                        </div>

                        <div
                            className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTodoStatus(todo.id, "recurring");
                            }}
                        >
                            { todo.recurring ? <TbRepeat /> : <TbRepeatOff />}
                        </div>

                        <div
                            className="p-1 rounded-md hover:scale-125 dark:text-slate-400 transition-all duration-300 hover:dark:text-slate-50 text-slate-700 hover:text-slate-950 cursor-pointer todoremove"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTodoItem(todo.id);
                            }}
                        >
                            <IoIosCloseCircle />
                        </div>
                    </div>
                </div>
            </div>
		);
	};

	// Toggle Pinned or Completed Status
	const toggleTodoStatus = (id: string, field: "checked" | "pinned" | "recurring") => {
		const item = TodoListItems.find(item => item.id === id);
		if (item) {
			item[field] = !item[field];
		}
		saveUserTodoListItems(TodoListItems);
	};
	
	// Remove todo item
	const removeTodoItem = (id: string) => {
		const index = TodoListItems.findIndex(item => item.id === id);
		if (index !== -1) {
			TodoListItems.splice(index, 1);
		}
		saveUserTodoListItems(TodoListItems);
	};

    const addTodoTag = () => {
        const tagTitle = tagRef.current?.value.trim() || '';
        if (tagTitle === '' || (todoTags.findIndex( (elem) => (elem === tagTitle) ) !== -1)) {
            return
        }
        saveUserTodoTags([ ...todoTags, tagTitle ]);
        if (tagRef.current) {
            tagRef.current.value = ''; // Clear the input by directly modifying the DOM element
        }
    }

    const addTodoItem = () => {
        const todoTitle = inputRef.current?.value.trim() || '';
        if (todoTitle === '' || todoTag === '') {
            return
        }
        const id = "tl" + Date.now();
        TodoListItems.push({
            id: id,
            title: todoTitle,
            pinned: false,
            checked: false,
            recurring: false,
            tag: todoTag,
        })
        saveUserTodoListItems(TodoListItems);
        if (inputRef.current) {
            inputRef.current.value = ''; // Clear the input by directly modifying the DOM element
        }
    }

    const TagWiseList = () => {
        return todoTags.map((tag)=>{
            return (
                <div key={tag} className='flex flex-col w-full items-center justify-center gap-6'>
                    {(TodoListItems.filter((todo: typeTodoListItem) => { return todo.tag===tag }).length > 0) ? <h1 className='text-2xl font-semibold'>{tag.charAt(0).toUpperCase()+tag.slice(1)}</h1> : <></>}
                    {TodoListItems.filter((todo: typeTodoListItem) => { return todo.tag===tag }).map((todo: typeTodoListItem) => { return createTodoItem(todo) })}
                </div>
            )
        })
    }

    const DisplayStatusList = (status: 'pinned' | 'checked' | 'recurring') => {
        return (
            <>
            {(TodoListItems.filter((todo: typeTodoListItem) => { return todo[status] }).length > 0) ? <h1 className='text-2xl font-semibold'>
                {(status==='checked') ? "Completed" : ((status==='pinned') ? "Pinned" : "Dalies" )}
            </h1> : <></>}
            {TodoListItems.filter((todo: typeTodoListItem) => { return todo[status] }).map((todo: typeTodoListItem) => { return createTodoItem(todo) })}
            </>
        );
    }

    // Handle outside click to close the dropdown
	useEffect(() => {
		const todoLastUpdateDate = localStorage.getItem("todoLastUpdateDate");
		const todoCurrentDate = new Date().toLocaleDateString();

		if (todoLastUpdateDate !== todoCurrentDate) {
			const updatedTodoListItems: typeTodoListItem[] = [];
			for (const todo of TodoListItems) {
				if (todo.recurring && todo.checked) {
					todo.checked = false;
				}
                updatedTodoListItems.push(todo);
			}
			TodoListItems = updatedTodoListItems;
			saveUserTodoListItems(TodoListItems);
			localStorage.setItem("todoLastUpdateDate",todoCurrentDate);
		}
	}, []);

    return (
        <div className='Todolist flex flex-col w-full items-center justify-center mt-20 gap-6 pb-8'>
            <div className='p-2 bg-slate-300 dark:bg-slate-700 max-w-screen-sm w-full rounded-2xl scale-125 origin-bottom hover:scale-[1.35] max-md:scale-90 max-md:hover:scale-90 transition-all duration-300'>
                <div className='flex relative'>
                    <input
                    type="text"
                    className='p-2 pr-14 bg-transparent w-full outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400'
                    placeholder='Add Item...'
                    ref={inputRef}
                    onKeyDown={(e) => e.key === 'Enter' && addTodoItem()}
                    />
                    <button className='absolute flex items-center justify-center px-3 py-2 leading-4 dark:bg-red-500 bg-blue-600 text-slate-50 right-1.5 top-1 rounded-lg active:scale-75 transition-all duration-300' onClick={addTodoItem}>+</button>
                </div>
                <div className='flex gap-2 p-2 flex-wrap'>
                    <span>Tags &rarr; </span>
                    {todoTags.map((elem, key)=> {
                        return (
                                <label className='px-3 py-0.5 max-w-[110px] text-ellipsis overflow-hidden rounded-full cursor-pointer bg-slate-950/20 dark:bg-slate-950/30 has-[:checked]:bg-blue-600 has-[:checked]:dark:bg-red-500 has-[:checked]:text-slate-50' htmlFor={`todotag`+(key+1)} key={`todotag`+(key+1)} >
                                    {elem}
                                    <input
                                        hidden
                                        type='radio'
                                        name='todotag'
                                        checked={todoTag===elem}
                                        id={`todotag`+(key+1)}
                                        value={elem}
                                        onChange={(e) => setTodoTag(e.target.value)}
                                    />
                                </label>
                        )
                    })}
                    <div className='px-3 py-0.5 rounded-full flex gap-1 bg-slate-950/20 dark:bg-slate-950/30 has-[:checked]:bg-blue-600 has-[:checked]:dark:bg-red-500 has-[:checked]:text-slate-50'>
                        <input
                            type='text'
                            className='bg-transparent text-xs w-full max-w-16 outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400'
                            placeholder='Add Tag...'
                            onKeyDown={(e) => e.key === 'Enter' && addTodoTag()}
                            ref={tagRef}
                        />
                        <button onClick={addTodoTag}>+</button>
                    </div>
                    <button onClick={()=> {saveUserTodoTags(["personal", "work"])}}><TbRepeat /></button>
                </div>
            </div>
            <div>
                <div>
                    Filter By <select className='bg-slate-300 dark:bg-slate-800 p-1 rounded-md ml-2 outline-none accent-red-600' onChange={(e)=>{setTodoFilter(e.target.value)}} defaultValue={"all"}>
                        <option value={"all"}>All</option>
                        <option value={"tags"}>Tags</option>
                        <option value={"checked"}>Completed</option>
                        <option value={"pinned"}>Pinned</option>
                        <option value={"recurring"}>Dalies</option>
                    </select>
                </div>
            </div>
            {
                ((todoFilter==="tags") ? <TagWiseList /> : ((todoFilter==="checked") ? DisplayStatusList(todoFilter) : ((todoFilter==="pinned") ? DisplayStatusList(todoFilter) : ((todoFilter==="recurring") ? DisplayStatusList(todoFilter) : TodoListItems.map((elem)=>{return createTodoItem(elem)})))))
            }
            {
                // true ? TodoListItems.filter((todo: typeTodoListItem) => { return todo['checked'] }).map((todo: typeTodoListItem) => { return createTodoItem(todo) })
                // : TodoListItems.map((todo: typeTodoListItem) => { return createTodoItem(todo) })
            }
        </div>
    )
}

export default Todolist