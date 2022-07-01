// Project Type and enum ProjectStatus
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;

// *********************************** State Class ***********************************
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFunction: Listener<T>) {
    this.listeners.push(listenerFunction);
  }
}



// *********************************** Project State Management Class ***********************************
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  //   Guarantees only one object of the type
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  //   Guarantees only one object of the type
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

 

  addProject(title: string, description: string, numPeople: number) {
    // Create new user input object
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numPeople,
      ProjectStatus.Active
    );
    // Add to the array
    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

// Global instance of ProjectState
const projectState = ProjectState.getInstance();

// Validation interface
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// Validation function
function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.min === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.max === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// Autobind decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // 	Storing originl method
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}

// *********************************** Component Base Class ***********************************

abstract class Component<T extends HTMLElement> {
  hostElement: T;

  constructor(hostElementId: string) {
    this.hostElement = document.getElementById(hostElementId)! as T;
  }
}

// *********************************** ProjectItem Class ***********************************

// class ProjectItem extends Component<HTMLDivElement> {

// }

// *********************************** ProjectList Class ***********************************
class ProjectList extends Component<HTMLDivElement> {
  activeSection: HTMLElement;
  finishedSection: HTMLElement;
  assignedProjects: Project[];

  constructor() {
    super("project-list");
    this.assignedProjects = [];
    this.activeSection = document.getElementById(
      "active-projects-list"
    )! as HTMLElement;
    this.finishedSection = document.getElementById(
      "finished-projects-list"
    )! as HTMLElement;

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = this.activeSection! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      const newListItem = document.createElement("li");
      newListItem.textContent = prjItem.title;
      listEl.appendChild(newListItem);
    }
  }
}

// *********************************** ProjectInput Class ***********************************
class ProjectInput extends Component<HTMLDivElement> {
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("app");
    this.element = document.querySelector("#user_input") as HTMLFormElement;

    this.titleInputElement = document.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = document.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = document.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    // Using the Validatable interface to validate input
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid Input. Please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  // 	Using bind(this) to make the this keyword in the submitHandler refer to the Class
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
}

const prjInput = new ProjectInput();

const activePrjList = new ProjectList();
const finishedPrjList = new ProjectList();
