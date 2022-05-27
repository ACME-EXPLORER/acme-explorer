import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  test('should render', () => {
    render(<HashRouter><LoginPage /></HashRouter>);

    const signupBotton = screen.getByText(/Regístrate/i);
    expect(signupBotton).toBeInTheDocument();
  });
});
