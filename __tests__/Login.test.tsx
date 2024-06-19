import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import LoginPage from '../src/pages/login';
import { useRouter } from 'next/router';
import { login } from '../src/services/LoginService';
import { getUserId } from '../src/services/ProfileService';
import { showToastMessage } from '@/components/Toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Mock necessary modules
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../src/services/LoginService', () => ({
  login: jest.fn(),
}));
jest.mock('../src/services/ProfileService', () => ({
  getUserId: jest.fn(),
}));
jest.mock('@/components/Toastify', () => ({
  showToastMessage: jest.fn(),
}));
jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn().mockResolvedValue({}),
}));

describe('LoginPage', () => {
  const mockedUseRouter = useRouter as jest.Mock;
  const mockedLogin = login as jest.Mock;
  const mockedGetUserId = getUserId as jest.Mock;
  const mockedShowToastMessage = showToastMessage as jest.Mock;

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  fit('should render the login page correctly', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/LOGIN_PAGE.USERNAME/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LOGIN_PAGE.PASSWORD/i)).toBeInTheDocument();
    expect(screen.getByText(/LOGIN_PAGE.LOGIN/i)).toBeInTheDocument();
  });

  it('should handle username change and error state', () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: 'test user' } });

    expect(usernameInput).toHaveValue('testuser'); // Username is trimmed and no spaces are allowed
    expect(screen.getByText(/login/i)).toBeDisabled();
  });

  it('should handle password change', () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput).toHaveValue('password123');
  });

  it('should toggle password visibility', () => {
    render(<LoginPage />);

    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should handle form submission successfully', async () => {
    mockedLogin.mockResolvedValue({
      result: {
        access_token: 'mocked_access_token',
        refresh_token: 'mocked_refresh_token',
      },
    });
    mockedGetUserId.mockResolvedValue({ userId: 'mocked_user_id' });

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByText(/login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(mockedGetUserId).toHaveBeenCalled();
    });

    const router = useRouter();
    expect(router.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle form submission with errors', async () => {
    mockedLogin.mockRejectedValue({ response: { status: 404 } });

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByText(/login/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockedShowToastMessage).toHaveBeenCalledWith(
        'LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT',
        'error'
      );
    });

    expect(screen.getByText(/login/i)).not.toBeDisabled();
  });

  it('should handle language change', () => {
    render(<LoginPage />);

    const selectLanguage = screen.getByDisplayValue('en');
    fireEvent.change(selectLanguage, { target: { value: 'fr' } });

    expect(localStorage.getItem('preferredLanguage')).toBe('fr');
  });

  it('should handle "remember me" checkbox click', () => {
    render(<LoginPage />);

    const rememberMeCheckbox = screen.getByRole('checkbox');
    fireEvent.click(rememberMeCheckbox);

    expect(rememberMeCheckbox).toBeChecked();

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });
});
