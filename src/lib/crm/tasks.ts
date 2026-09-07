import type { CRMState, CRMTask, TaskStatus } from "../types";

export function setTaskStatus(state: CRMState, id: string, status: TaskStatus): CRMState {
  return {
    ...state,
    tasks: state.tasks.map((task) => task.id === id ? { ...task, status } : task),
  };
}

export function addTask(state: CRMState, title: string, relatedTo: string): CRMState {
  const task: CRMTask = {
    id: crypto.randomUUID(),
    title,
    description: "Created from task dashboard",
    priority: "Medium",
    status: "To do",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
    relatedTo: relatedTo || "General",
    relatedToId: state.companies.find((company) => company.name === relatedTo)?.id,
  };
  return { ...state, tasks: [...state.tasks, task] };
}
