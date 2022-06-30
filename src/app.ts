
class ProjectInput {
	
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;
	
	constructor(){
// 		Get elements by ID
		this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;
		
		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		this.element.id = "user-input";
		
		this.titleInputElement = document.querySelector('#title')! as HTMLInputElement;
		this.descriptionInputElement = document.querySelector("#description")! as HTMLInputElement;
		this.peopleInputElement = document.querySelector("#people")! as HTMLInputElement;
		
		this.configure();
		this.attach();
	}
	
		// Submit handler logic
	// private submitHandler(event: Event){
	// 	event.preventDefault();
		
	// 	console.log(this.titleInputElement.value);
	// }
	
	private submitHandler = (event : Event) => {
		event.preventDefault();
		
		console.log(this.titleInputElement.value);
	}


// 	Using bind(this) to make the this keyword in the submitHandler refer to the Class
	private configure = () => {
		this.element.addEventListener("submit", this.submitHandler);
	}
	
// 	Attach template to host
	private attach = () => { 
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}


const prjInput = new ProjectInput();
