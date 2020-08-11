import { Link } from '@redwoodjs/router'
import COVIDRegression from './COVIDRegression'

let x = [0.5, 1, 1.5, 2, 2.5]
let y = [0, 1, 2, 3, 4]

let regression = new ML.SimpleLinearRegression(x, y)
console.log(regression.slope)

const HomePage = () => {
  return (
    <>
      <COVIDRegression/>
    </>
  )
}

export default HomePage
