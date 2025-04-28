export function isLoggedIn() {
  return localStorage.getItem('user') !== null;
}


export function login(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem('user');
}

export function getUser() {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}