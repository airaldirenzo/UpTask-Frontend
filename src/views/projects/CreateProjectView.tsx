import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify"
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";
import { useMutation } from "@tanstack/react-query";

export default function CreateProjectView() {
    const navigate = useNavigate()
    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: "",
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    // Las mutaciones se utilizan para crear, editar y eliminar
    // Para obtener datos se utilizan los queries
    const mutation = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate("/")
        }
    })

    const handleForm = (formData : ProjectFormData) => {
        // Usando mutate no requiero definir el handle como async
        // ni usar un await en el mutation ya que React-Query se encarga
        mutation.mutate(formData)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Crear Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">
                Llena el siguiente formulario para crear un proyecto
            </p>
            <nav className="my-5">
                <Link
                    className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                    to="/"
                >
                    Volver a Proyectos
                </Link>
            </nav>
            <form
                className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate //Desactivamos la validacion de HTML y la validamos con react hook form
            >
                <ProjectForm
                    register={register}
                    errors={errors}
                    >
                    
                </ProjectForm>
                <input
                    type="submit"
                    value="Crear Proyecto"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                />
            </form>
        </div>
    );
}
