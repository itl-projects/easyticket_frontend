import { useSelector } from 'react-redux';

export default function useProvideAuth() {
  const user = useSelector((state) => state.auth.idToken);

  return {
    user
  };
}
