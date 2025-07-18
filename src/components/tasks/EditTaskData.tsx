import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getTaskById } from "@/api/TaskAPI"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get("editTask")!

    const {data, isError} = useQuery({
        queryKey: ["task", taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        //enabled permite o no realizar la consulta en base a una condición.
        //En este caso queremos que se realize la consulta si taskId != null
        // Puede ser null ya que este componente se renderiza en ProjectDetailsView
        // y en esa URL no hay un taskId hasta que no selecciono para editar una task
        enabled: !!taskId // Es lo mismo que taskId ? true : false
    })
    if(isError) return <Navigate to={"/404"}></Navigate>
    if(data) return <EditTaskModal data={data} taskId={taskId}></EditTaskModal>
}
