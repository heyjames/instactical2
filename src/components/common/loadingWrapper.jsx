import { renderLoadingIndicator } from './loading';

const LoadingWrapper = ({ children, loading }) => {
  return loading ? renderLoadingIndicator() : children
}
 
export default LoadingWrapper;