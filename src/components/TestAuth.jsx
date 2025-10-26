import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const TestAuth = () => {
  const { currentUser, loading } = useSelector((state) => state.user)
  const navigate = useNavigate()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Auth Test</h1>
      {currentUser ? (
        <div>
          <p>User is logged in: {currentUser.email}</p>
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
      ) : (
        <div>
          <p>User is not logged in</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}
    </div>
  )
}

export default TestAuth