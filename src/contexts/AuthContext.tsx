"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  nome: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, senha: string) => Promise<boolean>
  register: (nome: string, email: string, senha: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado no localStorage (apenas no cliente)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Erro ao carregar usuário:", error)
          localStorage.removeItem("currentUser")
        }
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      if (typeof window === "undefined") return false

      // Buscar usuários do localStorage
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []

      // Verificar credenciais
      const foundUser = users.find(
        (u: any) => u.email === email && u.senha === senha
      )

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          nome: foundUser.nome,
          email: foundUser.email,
        }
        setUser(userData)
        localStorage.setItem("currentUser", JSON.stringify(userData))
        return true
      }

      return false
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return false
    }
  }

  const register = async (
    nome: string,
    email: string,
    senha: string
  ): Promise<boolean> => {
    try {
      if (typeof window === "undefined") return false

      // Buscar usuários existentes
      const usersData = localStorage.getItem("users")
      const users = usersData ? JSON.parse(usersData) : []

      // Verificar se email já está cadastrado
      const emailExists = users.some((u: any) => u.email === email)
      if (emailExists) {
        return false
      }

      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        nome,
        email,
        senha,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Fazer login automaticamente
      const userData = {
        id: newUser.id,
        nome: newUser.nome,
        email: newUser.email,
      }
      setUser(userData)
      localStorage.setItem("currentUser", JSON.stringify(userData))

      return true
    } catch (error) {
      console.error("Erro ao registrar:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
