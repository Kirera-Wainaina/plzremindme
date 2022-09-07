import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
//import '@testing-library/jest-dom';
import React from 'react';

import AdminSignup from './AdminSignup.js'

test('displays error if passwords dont match', async () => {
    const user = userEvent.setup();
    render(<AdminSignup />);

    // Act
    await user.click(screen.getByLabelText('First Name'));
    await user.keyboard('rich');
    await user.click(screen.getByLabelText('Email'));
    await user.keyboard('richard@gmail.com');
    await user.click(screen.getByLabelText('Password'));
    await user.keyboard('rich');
    await user.click(screen.getByLabelText('Repeat Password'));
    await user.keyboard('ard');
    await user.click(screen.getByLabelText('Admin Password'));
    await user.keyboard('123');
    await user.click(screen.getByRole('button', {text: 'Submit'}));
    
    // Assert
    expect(screen.getByText(/'repeat password' should match/i))
})