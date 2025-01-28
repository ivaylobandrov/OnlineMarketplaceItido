import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '@/components/LoginForm';
import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);
const store = mockStore({});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form and submits successfully', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'testpassword' },
    });

    // Mock API response
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, token: 'mock-token' }),
      })
    );

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });

    expect(store.getActions()).toContainEqual({
      type: 'auth/login',
      payload: { token: 'mock-token' },
    });
    expect(useRouter().push).toHaveBeenCalledWith('/'); // Ensuring the router push works
  });

  it('displays error message on login failure', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: 'testuser' },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'testpassword' },
    });

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ success: false, message: 'Invalid credentials' }),
      })
    );

    fireEvent.click(screen.getByText(/login/i));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
