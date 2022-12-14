import { UserDataService } from './../../Services/user-data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import {  getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from "firebase/auth";
import { environment } from 'src/environments/environment';
import { getDatabase, ref, get } from 'firebase/database';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {


  constructor(private router: Router, private user_data_service:UserDataService) { }

  ngOnInit(): void {
    
  }

  uname = "";

  app = initializeApp(environment.firebase)
  realdb = getDatabase(this.app)

  auth = getAuth(this.app)

  // provider = new GoogleAuthProvider();

  user_details:any;
  bg_url = ""


  async signIn(loginEmail:any, loginPass:any) {
    const userCredential = await signInWithEmailAndPassword(this.auth, loginEmail, loginPass)
    .then((userCredential) => {
      //const user = userCredential.user;
      console.log(userCredential.user)
      console.log("LogedIn")
      this.user_data_service.email = loginEmail;
      this.router.navigate(["/home"],{ queryParams: { email:loginEmail } })
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Username or Password incorrect")
      console.log("There was some error logging in!")
    });

  }


   async forgotPass() {
    let fpemail: any
    console.log("forgot password method called")
    fpemail = prompt("Enter your email:");
    console.log("password reset email:", fpemail)
    sendPasswordResetEmail(this.auth, fpemail)
  .then(() => {
    // Password reset email sent!
    console.log("password reset email2:", fpemail)
    alert("Check your email for a reset password link.")
    // this.router.navigate(['sign-in'])
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });

  }

  go_to_register() {
    this.router.navigate(['/register'])
    console.log("Entered Registration Page")
  }


// take_me_to_chats(username:string)
// {
//   this.Router.navigate(["/home"],{ queryParams: { user: username } })
// }

}
