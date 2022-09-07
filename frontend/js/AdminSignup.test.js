import _regeneratorRuntime from 'babel-runtime/regenerator';

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

import AdminSignup from '../js/AdminSignup.js';

test('displays error if passwords dont match', _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    var user;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    render(React.createElement(AdminSignup, null));
                    user = userEvent.setup();

                    // Act

                    _context.next = 4;
                    return user.click(screen.getByLabelText('First Name'));

                case 4:
                    _context.next = 6;
                    return user.keyboard('rich');

                case 6:
                    _context.next = 8;
                    return user.click(screen.getByLabelText('Email'));

                case 8:
                    _context.next = 10;
                    return user.keyboard('richard@gmail.com');

                case 10:
                    _context.next = 12;
                    return user.click(screen.getByLabelText('Password'));

                case 12:
                    _context.next = 14;
                    return user.keyboard('rich');

                case 14:
                    _context.next = 16;
                    return user.click(screen.getByLabelText('Repeat Password'));

                case 16:
                    _context.next = 18;
                    return user.keyboard('ard');

                case 18:
                    _context.next = 20;
                    return user.click(screen.getByLabelText('Admin Password'));

                case 20:
                    _context.next = 22;
                    return user.keyboard('123');

                case 22:
                    _context.next = 24;
                    return user.click(screen.getByRole('input', { text: 'Submit' }));

                case 24:

                    // Assert
                    expect(screen.getByText(/'repeat password' should match/i));

                case 25:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, _this);
})));