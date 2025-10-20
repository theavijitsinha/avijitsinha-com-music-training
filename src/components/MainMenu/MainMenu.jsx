import {
  CloseOutlined,
} from "@ant-design/icons"
import {
  Button,
  Typography,
} from "antd"
import {
  useState,
} from "react"

import TrainingOptions from "../TrainingOptions/TrainingOptions"
import {
  signInWithGoogleRedirect,
  signOutUser,
  useAuth,
} from "../../utils/firebase"

import googleLogo from "../../assets/google.svg"

import "./MainMenu.css"

const {
  Title,
  Text
} = Typography

function MainMenu(props) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const { authUser, authLoading } = useAuth()

  return (
    <div
      className="menu"
    >
      <div
        className="menu-title"
      >
        <Title>
          Intervals Training
        </Title>
      </ div>
      <Button
        color="primary"
        variant="solid"
        className="menu-button"
        shape="round"
        onClick={props.startTraining}
      >
        Start
      </Button>
      <Button
        color="primary"
        variant="outlined"
        className="menu-button"
        shape="round"
        onClick={() => setIsOptionsOpen(true)}
      >
        Options
      </Button>
      {
        authUser === null ?
          <Button
            color="primary"
            variant="outlined"
            className="menu-button google-login-button"
            shape="round"
            disabled={authLoading}
            onClick={signInWithGoogleRedirect}
          >
            <img
              className="google-login-button-icon"
              src={googleLogo}
            />
            Sign in with Google
          </Button> :
          null
      }
      {
        authUser ?
          <div
            className="profile-info"
            onClick={() => setIsProfileOpen(true)}
          >
            <Text
              className="profile-info-name"
            >
              {
                authUser.displayName || authUser.email || ""
              }
            </Text>
            <img
              className="profile-info-photo"
              src={
                authUser.photoURL ||
                "https://ui-avatars.com/api/?name=" + encodeURIComponent(
                  authUser.displayName || authUser.email || "?"
                )
              }
            />
          </div>
          :
          null
      }
      {
        authUser && isProfileOpen ?
          <div
            className="profile-view"
          >
            <div
              className="profile-view-photo-container"
            >
              <img
                className="profile-view-photo"
                src={
                  authUser.photoURL ||
                  "https://ui-avatars.com/api/?name=" + encodeURIComponent(
                    authUser.displayName || authUser.email || "?"
                  )
                }
              />
            </div>
            <Text
              className="profile-view-name"
            >
              {
                authUser.displayName || "Anonymous"
              }
            </Text>
            <Text
              className="profile-view-email"
            >
              {
                authUser.email || ""
              }
            </Text>
            <Button
              color="primary"
              variant="outlined"
              className="menu-button"
              shape="round"
              onClick={signOutUser}
            >
              Sign out
            </Button>
            <Button
              className="profile-view-close-button"
              color="primary"
              variant="outlined"
              onClick={() => setIsProfileOpen(false)}
              icon={<CloseOutlined />}
              shape="circle"
            />

          </div> :
          null
      }
      {
        isOptionsOpen ?
          <TrainingOptions
            options={props.options}
            setOptions={props.setOptions}
            onClose={() => setIsOptionsOpen(false)}
          />
          : null
      }
    </ div>
  )
}

export default MainMenu
