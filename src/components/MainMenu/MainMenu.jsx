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

function googleProfilePhoto(user) {
  if (!user.photoURL) return null
  try {
    const url = new URL(user.photoURL)
    return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com" ? url.toString() : null
  } catch {
    return null
  }
}

function ProfileAvatar({ user, className }) {
  const photoUrl = googleProfilePhoto(user)
  if (photoUrl) {
    return (
      <img
        alt=""
        className={className}
        referrerPolicy="no-referrer"
        src={photoUrl}
      />
    )
  }
  const label = user.displayName || user.email || "Google account"
  return (
    <span
      aria-hidden="true"
      className={`${className} profile-avatar-fallback`}
    >
      {label.slice(0, 1).toUpperCase()}
    </span>
  )
}

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
            onClick={() => { void signInWithGoogleRedirect() }}
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
          <button
            aria-label="Open account profile"
            className="profile-info"
            onClick={() => setIsProfileOpen(true)}
            type="button"
          >
            <Text
              className="profile-info-name"
            >
              {
                authUser.displayName || authUser.email || "Google account"
              }
            </Text>
            <ProfileAvatar
              className="profile-info-photo"
              user={authUser}
            />
          </button>
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
              <ProfileAvatar
                className="profile-view-photo"
                user={authUser}
              />
            </div>
            <Text
              className="profile-view-name"
            >
              {
                authUser.displayName || "Google account"
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
              onClick={() => { void signOutUser() }}
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
