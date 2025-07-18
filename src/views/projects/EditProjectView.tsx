import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {
    const params = useParams();
    // Con el ! le decimos a TS que no será undefined
    const projectId = params.projectId!;
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if(isLoading) return "Cargando..."
    if(isError) return <Navigate to="/404" ></Navigate>

    if(data) return(
        
        <EditProjectForm data={data} projectId={projectId}></EditProjectForm>
        
    )
}
