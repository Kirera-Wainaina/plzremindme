export default function AdminSignup() {
    return React.createElement(
        'form',
        { className: 'card' },
        React.createElement(
            'p',
            null,
            'Please Sign up. Login if you have an account'
        ),
        React.createElement(
            'label',
            null,
            'Email ',
            React.createElement('input', { className: 'input', type: 'email' })
        ),
        React.createElement(
            'label',
            null,
            'Password ',
            React.createElement('input', { className: 'input', type: 'password' })
        ),
        React.createElement(
            'label',
            null,
            'Admin Password ',
            React.createElement('input', { className: 'input', type: 'password' })
        ),
        React.createElement('input', { type: 'submit', value: 'Submit', className: 'button' })
    );
}