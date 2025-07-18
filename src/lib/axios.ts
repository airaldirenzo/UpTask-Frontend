import axios from "axios"
// Al tener una URL base nos ahorramos muchos cambios en caso de que cambie el servidor
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use( config => {
    const jwtoken = localStorage.getItem("AUTH_JWTOKEN")
    if(jwtoken){
        config.headers.Authorization = `Bearer ${jwtoken}`
    }
    return config
})

export default api