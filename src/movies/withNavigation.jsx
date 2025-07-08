import { useNavigate } from 'react-router-dom'

const withNavigation = (Component) => {
  return function WrappedComponent(props) {
    const navigate = useNavigate()
    console.log(navigate)
    return <Component {...props} navigate={navigate} />
  }
}

export default withNavigation
