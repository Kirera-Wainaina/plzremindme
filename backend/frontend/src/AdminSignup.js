export default function AdminSignup() {
    return (
        <form className='card'>
            <p>Please Sign up. Login if you have an account</p>
            <label>Email <input className='input' type='email'/></label>
            <label>Password <input className='input' type='password' /></label>
            <label>Admin Password <input className='input' type='password' /></label>
            <input type='submit' value='Submit' className="button"/>
        </form>
    )
}