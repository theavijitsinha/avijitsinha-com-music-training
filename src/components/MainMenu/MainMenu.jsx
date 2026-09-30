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
  useAccount,
} from "../../utils/account-context"

import googleLogo from "../../assets/google.svg"

import "./MainMenu.css"

const {
  Title,
  Text
} = Typography

function ProfileAvatar({ user, className }) {
  if (user.pictureUrl) {
    return (
      <img
        alt=""
        className={className}
        referrerPolicy="no-referrer"
        src={user.pictureUrl}
      />
    )
  }
  const label = user.displayName || user.email || "Account"
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

  const {
    accountUser,
    accountLoading,
    accountBusy,
    accountError,
    refreshAccount,
    signIn,
    signOut,
  } = useAccount()

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
        accountUser === null ?
          <Button
            color="primary"
            variant="outlined"
            className="menu-button google-login-button"
            shape="round"
            disabled={accountLoading || accountBusy}
            onClick={signIn}
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
        accountUser ?
          <button
            aria-label="Open account profile"
            className="profile-info"
            disabled={accountBusy}
            onClick={() => setIsProfileOpen(true)}
            type="button"
          >
            <Text
              className="profile-info-name"
            >
              {
                accountUser.displayName || accountUser.email || "Account"
              }
            </Text>
            <ProfileAvatar
              className="profile-info-photo"
              user={accountUser}
            />
          </button>
          :
          null
      }
      {
        accountUser && isProfileOpen ?
          <div
            className="profile-view"
          >
            <div
              className="profile-view-photo-container"
            >
              <ProfileAvatar
                className="profile-view-photo"
                user={accountUser}
              />
            </div>
            <Text
              className="profile-view-name"
            >
              {
                accountUser.displayName || "Google account"
              }
            </Text>
            <Text
              className="profile-view-email"
            >
              {
                accountUser.email || ""
              }
            </Text>
            <Button
              color="primary"
              variant="outlined"
              className="menu-button"
              shape="round"
              disabled={accountBusy}
              onClick={() => { void signOut() }}
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
        accountError ?
          <div className="account-status" role="status">
            <Text>{accountError}</Text>
            <Button
              disabled={accountLoading || accountBusy}
              onClick={() => { void refreshAccount() }}
              type="link"
            >
              Retry
            </Button>
          </div>
          : null
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
