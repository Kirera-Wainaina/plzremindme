export default class AdminSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            email: null,
            password: null,
            adminPassword: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <form className='card' onSubmit={this.handleSubmit}>
                <h2>Signup</h2>
                <label>First Name <input required className="input" type='text'/></label>
                <label>Email <input required className='input' type='email'/></label>
                <label>Password <input required className='input' type='password' /></label>
                <label>Repeat Password <input required className='input' type='password' /></label>
                <label>Admin Password <input required className='input' type='password' /></label>
                <input type='submit' value='Submit' className="button" />
            </form>
        )
    }
}