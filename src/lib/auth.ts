const AUTH_KEY = 'visa_cnc_auth';

const VALID_CREDENTIALS = {
  email:    'aajilkhan555@gmail.com',
  password: 'afridi555',
};

export function login(email: string, password: string): boolean {
  if (
    email.trim().toLowerCase() === VALID_CREDENTIALS.email &&
    password === VALID_CREDENTIALS.password
  ) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}
