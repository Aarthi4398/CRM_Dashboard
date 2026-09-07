import dynamic from "next/dynamic";
import { HeavyVisualLoading } from "@/components/ui/heavy-visual-loading";
import "@/styles/pages/task-kanban.css";

const TaskKanbanPage = dynamic(() => import("@/components/pages/task-kanban-page"), {
  loading: () => <HeavyVisualLoading label="Loading kanban board" />,
});

export default function TaskKanbanLazyRoute() {
  return <TaskKanbanPage />;
}
