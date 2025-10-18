import {
  Button,
  Modal,
  Typography,
} from "antd"
import {
  useState,
} from "react"

import TrainingOptions from "../TrainingOptions/TrainingOptions"

import "./MainMenu.css"

const { Title } = Typography

function MainMenu(props) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

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
