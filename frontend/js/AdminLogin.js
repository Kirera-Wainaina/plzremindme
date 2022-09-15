var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AdminLogin = function (_React$Component) {
    _inherits(AdminLogin, _React$Component);

    function AdminLogin(props) {
        _classCallCheck(this, AdminLogin);

        var _this = _possibleConstructorReturn(this, (AdminLogin.__proto__ || Object.getPrototypeOf(AdminLogin)).call(this, props));

        _this.state = {
            email: null,
            password: null,
            status: null
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }

    _createClass(AdminLogin, [{
        key: 'handleChange',
        value: function handleChange(e) {
            this.setState(_defineProperty({}, e.target.name, e.target.value));
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            var _this2 = this;

            e.preventDefault();
            fetch('/api/AdminLogin', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: { 'content-encoding': 'application/json' }
            }).then(function (response) {
                return _this2.setState({ status: response.status });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'form',
                { className: 'card', onSubmit: this.handleSubmit },
                this.state.status == 401 && React.createElement(LoginError, null),
                React.createElement(
                    'h2',
                    null,
                    'Login'
                ),
                React.createElement(
                    'label',
                    null,
                    'Email',
                    React.createElement('input', { required: true, className: 'input', type: 'email', name: 'email', onChange: this.handleChange })
                ),
                React.createElement(
                    'label',
                    null,
                    'Password',
                    React.createElement('input', { required: true, className: 'input', type: 'password', name: 'password', onChange: this.handleChange })
                ),
                React.createElement('input', { type: 'submit', value: 'Submit', className: 'button' })
            );
        }
    }]);

    return AdminLogin;
}(React.Component);

export default AdminLogin;


function LoginError() {
    return React.createElement(
        'div',
        { className: 'error' },
        React.createElement(
            'p',
            null,
            'The email or password you entered is incorrect'
        )
    );
}