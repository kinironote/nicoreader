import { CircularProgress } from "@material-ui/core"

const Progress = (): JSX.Element => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    }}
  >
    <CircularProgress />
  </div>
)

export default Progress
