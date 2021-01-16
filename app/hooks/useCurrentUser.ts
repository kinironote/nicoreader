import { useQuery, useSession } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { useEffect } from "react"
import { User } from "@prisma/client"

export const useCurrentUser = (): Pick<User, "id" | "name" | "email" | "role"> | null => {
  const session = useSession()
  const [user, { refetch }] = useQuery(getCurrentUser, null)
  useEffect(() => {
    refetch().catch((e: Error) => {
      throw new Error(`Can't get current user status. message: ${e.message}`)
    })
  }, [session.userId, refetch])
  return user
}
