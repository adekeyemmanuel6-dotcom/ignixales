import { ProjectForm } from "@/components/admin/ProjectForm";
export default function NewProject() { return (<><h1 className="h-display text-4xl">New project</h1><div className="mt-6 max-w-4xl"><ProjectForm p={{ is_concept: true }} /></div></>); }
