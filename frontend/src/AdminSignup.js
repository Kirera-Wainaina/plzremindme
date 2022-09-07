export default class AdminSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: null,
            email: null,
            password: null,
            repeatPassword: null,
            adminPassword: null
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(this.state)
    }

    render() {
        return (
            <form className='card' onSubmit={this.handleSubmit}>
                <h2>Signup</h2>
                <label>First Name 
                    <input required className="input" type='text' name='firstName' onChange={this.handleChange}/>
                </label>
                <label>Email 
                    <input required className='input' type='email' name='email' onChange={this.handleChange}/>
                </label>
                <label>Password 
                    <input required className='input' type='password' name='password' onChange={this.handleChange}/>
                </label>
                <label>Repeat Password 
                    <input required className='input' type='password' name='repeatPassword' onChange={this.handleChange}/>
                </label>
                <label>Admin Password 
                    <input required className='input' type='password' name='adminPassword' onChange={this.handleChange}/>
                </label>
                <input type='submit' value='Submit' className="button" />
            </form>
        )
    }
}