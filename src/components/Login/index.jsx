import React from 'react'
import './style.css'
import firebase from '../../firebase'



class SingIn extends React.Component {

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login = async (e) =>{
    e.preventDefault();
    await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
      console.log('success', 'Signed-up successfully!');
      this.props.history.replace('/home')
    }).catch((error) => {
        alert(error);
      });
  }



  render(){
    return (

      <div className="register-container">
  <div className="register-form">
    <form id="login-form" >
      <input type="text" name="email" id="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} />
      <span id="emailError" />
      <input type="password" name="password" id="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
      <span id="passwordError" />
      <br />
      <input type="submit" onClick={this.login} value="Login" />
    </form>
  </div>
  <div className="register-msg">
    <h2>Get in touch</h2>
    <span>Don't have an account?</span>
    <br />
      <a href="/register">Register</a>

  </div>
</div>



    )
  }
}



export default SingIn;
