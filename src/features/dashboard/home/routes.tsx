import { type ReactNode } from "react"
import HomePage from "./HomePage"


export const homeRoutes: { path: string; element: ReactNode }[] = [
  {
    path: "/",
    element: <HomePage />
  }
]
