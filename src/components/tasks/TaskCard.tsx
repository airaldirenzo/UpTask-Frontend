import { TaskProject } from "@/types/index";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useDraggable } from "@dnd-kit/core"

type TaskCardProps = {
    task: TaskProject,
    canEdit: boolean
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
    //Es lo que vamos a arrastrar
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id
    })
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()

    console.log("TASKCARD",task);
    

    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ["project", projectId]})
            toast.success(data)
        }
    })
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px,${transform.y}px, 0)`,
        //Todas estas opciones son para simular que se mueva con un cuadro blanco,
        // es para que se vea mejor ya que la libreria de dnd-kit/core deshabilita las funciones
        // de los tres puntitos si muevo los ...listeners, ...atttributes y ref al <li></li>
        padding: "1.25rem",
        backgroundColor: "#FFF",
        width: "300px",
        display: "flex",
        borderWidth: "1px",
        borderColor: "rgb(203 213 225 / var(--tw-border-opacity))"
    } : undefined

    return (
        <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
            <div className="min-w-0 flex flex-col gap-y-4"
                {...listeners}
                {...attributes}
                ref={setNodeRef}
                style={style}>

                <p className="text-xl font-bold text-slate-600 text-left">{task.name}</p>
                <p className="text-slate-500">{task.description}</p>
            </div>

            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon
                            className="h-9 w-9"
                            aria-hidden="true"
                        />
                    </MenuButton>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem>
                                <button
                                    type="button"
                                    className="block px-3 py-1 text-sm leading-6 text-gray-900"
                                    onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
                                >
                                    Ver Tarea
                                </button>
                            </MenuItem>
                            {canEdit && (
                                <>
                                    <MenuItem>
                                        <button
                                            type="button"
                                            className="block px-3 py-1 text-sm leading-6 text-gray-900"
                                            onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}
                                        >Editar Tarea</button>
                                    </MenuItem>

                                    <MenuItem>
                                        <button
                                            type="button"
                                            className="block px-3 py-1 text-sm leading-6 text-red-500"
                                            onClick={() => mutate({projectId, taskId: task._id})}
                                        >Eliminar Tarea</button>
                                    </MenuItem>
                                </>
                            )}
                            
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </li>
    );
}
