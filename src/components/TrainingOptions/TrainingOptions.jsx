import {
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Button,
  Select,
  Slider,
  Typography,
} from "antd";
import React, {
  useState
} from "react";

import {
  intervals,
  directions,
  notes,
  lastOctave,
  firstOctave,
} from "../../constants"

import './TrainingOptions.css'

function TrainingOptions(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const setDirection = (directionKey) => {
    props.setOptions((prevOptions) => ({
      ...prevOptions,
      direction: directionKey,
    }))
  }

  const setRoots = (rootStrs) => {
    const rootStrsSet = new Set(rootStrs)
    const roots = {}
    for (let octave = firstOctave; octave <= lastOctave; octave++) {
      for (const note in notes) {
        if (Object.prototype.hasOwnProperty.call(notes, note)) {
          let label = note + String(octave)
          if (rootStrsSet.has(label)) {
            if (!roots.hasOwnProperty(octave)) {
              roots[octave] = []
            }
            roots[octave].push(note)
          }
        }
      }
    }
    props.setOptions((prevOptions) => ({
      ...prevOptions,
      roots: roots,
    }))
  }

  const setTimeGap = (timeGap) => {
    props.setOptions((prevOptions) => ({
      ...prevOptions,
      timeGap: timeGap,
    }))
  }

  const toggleSemitone = (semitone) => {
    props.setOptions((prevOptions) => {
      let semitones = new Set(prevOptions.semitones)
      semitones.has(semitone) ?
        semitones.delete(semitone) :
        semitones.add(semitone);
      return {
        ...prevOptions,
        semitones: semitones,
      }
    })
  }

  const rootNotesOptions = []
  for (let octave = firstOctave; octave <= lastOctave; octave++) {
    for (const note in notes) {
      if (Object.prototype.hasOwnProperty.call(notes, note)) {
        let label = note + String(octave)
        rootNotesOptions.push({
          label: label,
          value: label,
          octave: octave,
          note: note,
        })
      }
    }
  }

  const rootNotesValues = []
  Object.entries(props.options.roots).forEach(([octave, notes]) => {
    notes.forEach((note) => {
      rootNotesValues.push(note + String(octave))
    })
  })

  return (
    <React.Fragment>
      <Button
        className="sidebar-open-button"
        size="large"
        color="primary"
        variant="outlined"
        onClick={() => { setSidebarOpen(true) }}
        icon={<MenuOutlined />}
        shape="circle"
      />
      <div
        className="controls"
        style={{
          "--translate-x-size": sidebarOpen ? "0%" : "100%",
        }}
      >
        <Button
          className="sidebar-close-button"
          size="large"
          color="primary"
          variant="outlined"
          onClick={() => { setSidebarOpen(false) }}
          icon={<CloseOutlined />}
          shape="circle"
        />
        <div className="controls-scroll">
          <Typography.Title
            level={2}
          >
            Options
          </Typography.Title>
          <Typography.Title
            level={3}
          >
            Root notes
          </Typography.Title>
          <Select
            allowClear
            mode="multiple"
            style={{
              width: '100%',
            }}
            placeholder="Please select"
            value={rootNotesValues}
            onChange={setRoots}
            options={rootNotesOptions}
          />
          <Typography.Title
            level={3}
          >
            Playback direction
          </Typography.Title>
          {Object.entries(directions).map(([key, direction]) => (
            <Button
              key={key}
              className="option-button direction-button"
              shape="round"
              color="primary"
              variant={props.options.direction === key ? "solid" : "filled"}
              onClick={() => { setDirection(key) }}
            >
              {direction.name}
            </Button>
          ))}
          <Typography.Title
            level={3}
          >
            Note duration
          </Typography.Title>
          <Slider
            min={0.3}
            max={1}
            step={0.05}
            onChange={setTimeGap}
            value={props.options.timeGap}
          />
          <Typography.Title
            level={3}
          >
            Intervals
          </Typography.Title>
          {Object.entries(intervals).map(([key, interval]) => (
            <Button
              key={key}
              className="option-button interval-button"
              shape="round"
              color="primary"
              variant={props.options.semitones.has(interval.semitone) ? "solid" : "filled"}
              onClick={() => { toggleSemitone(interval.semitone) }}
            >
              {interval.name}
            </Button>
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}

export default TrainingOptions;
