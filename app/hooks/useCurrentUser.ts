import { useQuery, useSession } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { useEffect } from "react"

export const useCurrentUser = () => {
  const session = useSession()
  const [user, { refetch }] = useQuery(getCurrentUser, null)
  useEffect(() => {
    refetch()
  }, [session.userId, refetch])
  return user
}
