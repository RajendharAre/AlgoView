import { useAuth } from './hooks/useAuth'
import Auth from './components/Auth/Auth'
import MainApp from './components/MainApp'
import Loader from './components/Common/Loader'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  return user ? <MainApp /> : <Auth />
}

export default App
