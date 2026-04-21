import { BrowserRouter } from 'react-router-dom'
import useRouteElements from './hooks/useRouteElements'

function AppRoutes() {
  const routeElements = useRouteElements()
  return <>{routeElements}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
