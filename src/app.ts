
class ProjectUnput {
	
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	
	constructor(){
// 		Get elements by ID
		this.templateElement = document.getElementById("project-input")! as HTMLTemplateElement;
		this.hostElement = document.getElementById("app")! as HTMLDivElement;
		
		const importedNode = document.importNode(this.templateElement.content, true);
		this.element = importedNode.firstElementChild as HTMLFormElement;
		
		this.attach();
	}
	
// 	Attach template to host
	private attach(){
		this.hostElement.insertAdjacentElement("afterbegin", this.element);
	}
}


const prjInput = new ProjectUnput();
