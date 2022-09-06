export default class AdminSignup extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <form className='card' onSubmit={this.handleSubmit}>
                <p>Please Sign up. Login if you have an account</p>
                <label>Email <input className='input' type='email'/></label>
                <label>Password <input className='input' type='password' /></label>
                <label>Admin Password <input className='input' type='password' /></label>
                <input type='submit' value='Submit' className="button" />
            </form>
        )
    }
}