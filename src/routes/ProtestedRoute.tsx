import { useUserPermissionStore } from "@/stores/useUserPermissionStore"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const permissionData = useUserPermissionStore((state) => state.permissionData)
  if (!permissionData.hasPermission) {
    return <Navigate to="/login-verify" replace />
  }
  return <Outlet /> 
}

export default ProtectedRoute
