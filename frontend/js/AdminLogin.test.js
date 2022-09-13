import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AdminLogin from './AdminLogin';

global.fetch = jest.fn();

test('renders login', () => {
    const user = userEvent.setup();
    render(<AdminLogin />);

    // Assert
    expect(screen.getByText('Login')).toBeVisible();
    expect(screen.getByRole('button', { text: 'Submit'}))
})