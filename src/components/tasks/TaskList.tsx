import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateStatus } from "@/api/TaskAPI";
import { useParams } from "react-router-dom";

type TaskListProps = {
    tasks: TaskProject[],
    canEdit: boolean
};

/* Este tipo representa un objeto donde:
- Las claves (key) son de tipo string. Es decir, cualquier texto válido como clave.
- Los valores asociados a esas claves son arreglos de objetos del tipo Task (Task[]). 

Una variable del tipo GroupedTasks podría ser:
const grouped: GroupedTasks = {
    "pendientes": [
        { id: 1, title: "Estudiar TypeScript", completed: false },
        { id: 2, title: "Hacer ejercicio", completed: false }
    ],
    "completadas": [
        { id: 3, title: "Leer documentación", completed: true }
    ]
}

BASICAMENTE GroupedTasks es un objeto indexado por strings donde cada valor es un array de tareas
*/
type GroupedTasks = {
    [key: string]: TaskProject[];
};

const initialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
};



const statusStyles : {[key: string] : string} = {
    pending: "border-t-slate-500",
    onHold: "border-t-red-500",
    inProgress: "border-t-yellow-500",
    underReview: "border-t-blue-500",
    completed: "border-t-emerald-500",
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {
    
    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            
            //No es necesario invalidar ["task", taskId] ya que no necesitamos
            // refrescar el contenido de la tarea porque no lo estamos visualizando
            queryClient.invalidateQueries({queryKey:["project", projectId]})
        }
    })

    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
        currentGroup = [...currentGroup, task];
        return { ...acc, [task.status]: currentGroup };
    }, initialStatusGroups);
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event
        if(over?.id){
            const taskId = active.id.toString()
            const status = over.id as TaskStatus

            mutate({projectId, taskId, status})

            queryClient.setQueryData(["project", projectId], (prevData: Project) => {
                const updatedTasks = prevData.tasks.map((aTask) => {
                    if(aTask._id === taskId){
                        return {
                            ...aTask,
                            status
                        }
                    }
                    return aTask
                })
                return {
                    ...prevData,
                    tasks: updatedTasks
                }
            })
        }
    }

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
                {/* El DndContext debe contener el droppable (DropTask) y el draggable (TaskCard) */}
                <DndContext onDragEnd={handleDragEnd}>
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <div
                            key={status}
                            className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5"
                        >
                            <h3
                                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
                            >{statusTranslations[status]}</h3>
                            <DropTask status={status}></DropTask>
                            <ul className="mt-5 space-y-5">
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">
                                        No Hay tareas
                                    </li>
                                ) : (
                                    tasks.map((task) => (
                                        <TaskCard key={task._id} task={task} canEdit={canEdit} />
                                    ))
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>
        </>
    );
}
