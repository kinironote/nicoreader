import { BlitzPage, useMutation, useQuery } from "blitz"
import Layout from "app/layouts/Layout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import React, { Suspense, useEffect, useMemo, useState } from "react"
import { Callback, Content, Feed } from "app/types"
import loginMutation from "app/auth/mutations/login"
import logoutMutation from "app/auth/mutations/logout"
import signupMutation from "app/auth/mutations/signup"
import spawnGuestMutation from "app/auth/mutations/spawnGuest"
import getFeeds from "app/feeds/queries/getFeeds"
import Header from "app/components/header"
import Body from "../components/body"
import createFeedMutation from "app/feeds/mutations/createFeed"
import moveFeedMutation from "app/feeds/mutations/moveFeed"
import updateFeedMutation from "app/feeds/mutations/updateFeed"
import deleteFeedMutation from "app/feeds/mutations/deleteFeed"
import Progress from "app/components/progress"
import { CreateFeedInput } from "app/feeds/mutations/createFeed"
import { MoveFeedInput } from "app/feeds/mutations/moveFeed"
import { UpdateFeedInput } from "app/feeds/mutations/updateFeed"
import { DeleteFeedInput } from "app/feeds/mutations/deleteFeed"
import MoviePopup from "app/components/moviePopup"

export type MoviePopupType = {
  opened: boolean
  contentId?: Content["id"]
}

export type NicoReaderContextType = {
  setMoviePopupState: React.Dispatch<React.SetStateAction<MoviePopupType>>
  createFeed: Callback<CreateFeedInput>
  deleteFeed: Callback<DeleteFeedInput>
  updateFeed: Callback<UpdateFeedInput>
  moveFeed: Callback<MoveFeedInput>
}

export const NicoReaderContext = React.createContext<NicoReaderContextType>({} as any)

const Home: BlitzPage = () => {
  const currentUser = useCurrentUser()
  const [feeds, feedsOps] = useQuery<typeof getFeeds>(getFeeds, null, {
    enabled: !!currentUser,
    refetchOnWindowFocus: false,
    suspense: false,
  })

  const [login] = useMutation(loginMutation, {
    onSuccess: () => {
      feedsOps.refetch()
    },
  })
  const [signup] = useMutation(signupMutation, {
    onSuccess: () => {
      feedsOps.refetch()
    },
  })
  const [logout] = useMutation(logoutMutation, {
    onSuccess: () => {
      feedsOps.clear()
    },
  })
  const [spawnGuest] = useMutation(spawnGuestMutation)

  const [createFeed] = useMutation(createFeedMutation, {
    onSuccess: () => {
      feedsOps.refetch()
    },
  })
  const [moveFeed] = useMutation(moveFeedMutation, {
    onSuccess: () => {
      feedsOps.refetch()
    },
  })
  const [updateFeed] = useMutation(updateFeedMutation, {
    onSuccess: () => {
      feedsOps.refetch()
    },
  })
  const [deleteFeed] = useMutation(deleteFeedMutation, {
    onSuccess: () => {
      console.log("success!")
      feedsOps.refetch()
    },
  })

  const [moviePopupState, setMoviePopupState] = useState<MoviePopupType>({
    opened: false,
  })

  useEffect(() => {
    const autoLoginAsGuest = async () => {
      if (!currentUser) {
        const guest = await spawnGuest()
        login({ email: guest.email, password: guest.password })
      }
    }
    autoLoginAsGuest()
  }, [currentUser, spawnGuest, login])

  const nicoReaderContextValue = useMemo(
    () => ({
      setMoviePopupState,
      createFeed,
      deleteFeed,
      updateFeed,
      moveFeed,
    }),
    [setMoviePopupState, createFeed, deleteFeed, updateFeed, moveFeed]
  )

  return (feeds as Feed[] | null) == null ? (
    <Progress />
  ) : (
    <NicoReaderContext.Provider value={nicoReaderContextValue}>
      <Header
        login={login}
        signup={signup}
        logout={logout}
        isLoggedIn={currentUser != null && currentUser.role !== "guest"}
      />
      {feedsOps.isLoading === true ? (
        <Progress />
      ) : (
        <Body
          feeds={feeds}
          createFeed={createFeed}
          updateFeed={updateFeed}
          moveFeed={moveFeed}
          deleteFeed={deleteFeed}
        />
      )}
      <MoviePopup
        isOpened={moviePopupState.opened}
        contentId={moviePopupState.contentId}
        onClose={() => setMoviePopupState((m) => ({ ...m, opened: false }))}
      />
    </NicoReaderContext.Provider>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export const Index = () => (
  <Suspense fallback={<Progress />}>
    <Home />
  </Suspense>
)

export default Index
