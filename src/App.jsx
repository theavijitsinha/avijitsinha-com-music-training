import {
  ConfigProvider,
  theme,
} from "antd";
import {
  useEffect,
  useState,
} from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import IntervalQuiz from "./components/IntervalQuiz/IntervalQuiz";
import TrainingOptions from "./components/TrainingOptions/TrainingOptions";
import {
  storageBaseKey,
} from "./constants";

import './App.css';

function Root() {
  return (
    <div className="root-page" />
  )
}

function IntervalsTrainingPage() {
  const currentDataVersion = "0.1.0"
  const intervalOptionsKey = storageBaseKey + ".interval.options"
  const dataVersionKey = intervalOptionsKey + ".dataVersion"
  const timeGapKey = intervalOptionsKey + ".timeGap"
  const directionKey = intervalOptionsKey + ".direction"
  const rootsKey = intervalOptionsKey + ".roots"
  const semitonesKey = intervalOptionsKey + ".semitones"
  const getInitialOptions = () => {
    const options = {
      timeGap: 0.75,
      direction: "asc",
      roots: {
        4: new Set(["C", "D", "E"]),
        5: new Set(["C", "D"]),
      },
      semitones: new Set([2, 4, 5, 7]),
    }

    let storedDataVersion = localStorage.getItem(dataVersionKey)
    if (storedDataVersion === null) {
      localStorage.setItem(dataVersionKey, currentDataVersion)
    }
    let storedTimeGap = localStorage.getItem(timeGapKey)
    if (storedTimeGap === null) {
      storedTimeGap = "0.75"
      localStorage.setItem(timeGapKey, storedTimeGap)
    }
    options.timeGap = Number(storedTimeGap)
    let storedDirection = localStorage.getItem(directionKey)
    if (storedDirection === null) {
      storedDirection = "asc"
      localStorage.setItem(directionKey, storedDirection)
    }
    options.direction = storedDirection
    let storedRoots = localStorage.getItem(rootsKey)
    if (storedRoots === null) {
      storedRoots = JSON.stringify({
        4: ["C", "D", "E"],
        5: ["C", "D"]
      })
      localStorage.setItem(rootsKey, storedRoots)
    }
    const roots = {}
    Object.entries(JSON.parse(storedRoots)).forEach(([octave, notes]) => {
      roots[octave] = new Set(notes)
    })
    options.roots = roots
    let storedSemitones = localStorage.getItem(semitonesKey)
    if (storedSemitones === null) {
      storedSemitones = JSON.stringify([2, 4, 5, 7])
      localStorage.setItem(semitonesKey, storedSemitones)
    }
    options.semitones = new Set(JSON.parse(storedSemitones))
    return options
  }
  const [options, setOptions] = useState(getInitialOptions());

  useEffect(() => {

  }, [])

  const handleOptionsChange = (changeFunc) => {
    const currentOptions = options
    const newOptions = changeFunc(options)
    if (currentOptions.timeGap !== newOptions.timeGap) {
      localStorage.setItem(timeGapKey, String(newOptions.timeGap))
    }
    if (currentOptions.direction !== newOptions.direction) {
      localStorage.setItem(directionKey, newOptions.direction)
    }
    if (currentOptions.roots !== newOptions.roots) {
      const roots = {}
      Object.entries(newOptions.roots).forEach(([octave, notes]) => {
        roots[octave] = Array.from(notes)
      })
      localStorage.setItem(rootsKey, JSON.stringify(roots))
    }
    if (currentOptions.semitones !== newOptions.semitones) {
      localStorage.setItem(semitonesKey, JSON.stringify(Array.from(newOptions.semitones)))
    }
    return setOptions(changeFunc)
  }

  return (
    <div className="intervals-training-page">
      <IntervalQuiz
        options={options}
      />
      <TrainingOptions
        options={options}
        setOptions={handleOptionsChange}
      />
    </div>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Root />,
    },
    {
      path: "intervals",
      element: <IntervalsTrainingPage />,
    },
  ],
    {
      basename: "/music/training",
    }
  );
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#c3e3ff",
          colorTextLightSolid: "#141414",
          colorBgContainer: "#141414",
          colorPrimaryBorder: "#c3e3ff",
          colorBgSpotlight: "#c3e3ff",
        }
      }}
    >
      <div
        className="app"
        style={{
          backgroundColor: "#141414",
        }}
      >
        <audio id="silentAudio">
          <source src="/music/training/silent.mp3" type="audio/mp3" />
        </audio>
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;