// Autobind decorator

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor){
	
// 	Storing originl method
	const originalMethod = descriptor.value;
	const adjustedDescriptor: PropertyDescriptor = {
		configurable: true,
		get(){
			const boundFn = originalMethod.bind(this);
			return boundFn
		}
	}
	return adjustedDescriptor;
}




// Project Input Class
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
	
	private gatherUserInput(): [string, string, number] | void {
		
		const enteredTitle = this.titleInputElement.value;
		const enteredDescription = this.descriptionInputElement.value;
		const enteredPeople = this.peopleInputElement.value;
		
		if(enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length === 0 ){
			alert("Invalid Input. Please try again!");
			return;
		}else{
			return [enteredTitle, enteredDescription, +enteredPeople]	
		}
		
	}
	
	@Autobind
	private submitHandler(event : Event) {
		event.preventDefault();
		
		const userInput = this.gatherUserInput();
		
		if(Array.isArray(userInput)){
			const [title, description, people] = userInput;
			console.log(title, description, people)
		}
		
		
		
		
	}


// 	Using bind(this) to make the this keyword in the submitHandler refer to the Class
	private configure() {
		this.element.addEventListener("submit", this.submitHandler);
	}
	
// 	Attach template to host
	private attach() { 
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}


const prjInput = new ProjectInput();
