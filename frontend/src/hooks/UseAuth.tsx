type User = { name: string; avatarUrl?: string };

const UseAuth = (user: User | null, loading: boolean) => {
  const login = null;
  const register = null;
  const logout = null;
  const refresh = null;
  return { user, loading, login, register, logout, refresh };
};

export default UseAuth;
