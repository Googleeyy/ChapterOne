import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('chapterone_token')
      const savedUser  = localStorage.getItem('chapterone_user')
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch {
      localStorage.removeItem('chapterone_token')
      localStorage.removeItem('chapterone_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('chapterone_token', jwtToken)
    localStorage.setItem('chapterone_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('chapterone_token')
    localStorage.removeItem('chapterone_user')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('chapterone_user', JSON.stringify(updatedUser))
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a' }}>
        <div style={{ color: '#f59e0b', fontSize: '2rem' }}>📚</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
