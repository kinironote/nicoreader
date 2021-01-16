import React, { CSSProperties, memo } from "react"
import Popup from "reactjs-popup"
import { Content } from "app/types"

type MoviePopupPropType = {
  isOpened: boolean
  contentId?: Content["id"]
  onClose?: () => any
}

const MoviePopup = ({ isOpened, contentId, onClose }: MoviePopupPropType) => (
  <Popup
    modal
    closeOnDocumentClick
    open={isOpened}
    onClose={onClose}
    contentStyle={{
      ...styles.moviePopup,
      ...(() => {
        const ratio = 0.7
        if (window.innerWidth < window.innerHeight) {
          return {
            width: window.innerWidth * ratio,
            height: window.innerWidth * ratio * (130 / 230),
          }
        } else {
          return {
            width: window.innerHeight * ratio * (230 / 130),
            height: window.innerHeight * ratio,
          }
        }
      })(),
    }}
  >
    <>
      <iframe
        src={"https://embed.nicovideo.jp/watch/" + contentId + "?jsapi=1"}
        title="movie"
        frameBorder="0"
        allowFullScreen
        style={styles.movie}
      ></iframe>
    </>
  </Popup>
)

export default memo(MoviePopup)

const styles: Record<string, CSSProperties> = {
  moviePopup: {
    border: "none",
    padding: "none",
  },
  movie: {
    height: "100%",
    width: "100%",
  },
}
