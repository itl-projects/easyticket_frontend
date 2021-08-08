import { useSelector } from 'react-redux';

export default function useProvideAuth() {
  const { token, user } = useSelector((state) => ({
    token: state.auth.idToken,
    user: state.auth.user
  }));

  return {
    token,
    user
  };
}
