<template>
  <div class="background-color-add flex flex-center column">
    <div class="auth-container">
      <div :class="['auth-form', { 'slide-left': !isSignIn, 'slide-right': isSignIn }]">
        <div class="form-content">
          <div v-if="isSignIn">
            <h3>Sign In</h3>
            <div class="coloring field">
              <q-input v-model="signInUsername" filled label="Enter Username" bg-color="white" color="primary" required />

            </div>
            <div class="coloring field">
              <q-input v-model="signInPassword" filled label="Enter Password" bg-color="white" type="password" color="primary" required />

            </div>
            <div>
              <q-btn @click="signIn" label="Sign In" color="primary"  class="full-width" />
            </div>
            <div>
              <p>If you are a new User Please <a href="javascript:void(0)" @click="toggleForm">Sign Up</a></p>
            </div>
          </div>
          <div v-else>
            <h3>Sign Up</h3>
            <div class="coloring field">
              <q-input v-model="signUpUsername" type="text" filled label="Enter Username" bg-color="white" color="primary" />
            </div>
            <div class="coloring field">
              <q-input v-model="signUpEmail" filled type="email" label="Enter Email" bg-color="white" color="primary" @keyup="isValidEmail(signUpEmail)" />
               <div v-if="error"   class="error-message">
                <p>Please enter a valid email address</p>
              </div>

            </div>
            <div class="coloring field">
              <q-input v-model="signUpPassword" filled label="Enter Password" bg-color="white" type="password" color="primary"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}" title="enter atleat 1 digit amd 1 lower character and 1 upper character and l special character and be atleast 8 characters " />
            </div>
            <div>
              <q-btn @click="signUp" label="Sign Up" color="primary" class="full-width" />
            </div>
            <div>
              <p>Already have an account? <a href="javascript:void(0)" @click="toggleForm">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
      <div :class="['auth-slide', { 'slide-left': !isSignIn, 'slide-right': isSignIn }]">
        <div class="slide-content">
          <h2>{{ isSignIn ? 'Hello friends!' : 'Welcome back!' }}</h2>
          <p>{{ isSignIn ? 'Enter your personal details and start your journey with us.' : 'please signin with your personal info.' }}</p>
          <q-btn @click="toggleForm" :label="isSignIn ? 'Sign Up' : 'Sign In'" color="secondary" outline />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isSignIn: true,
      signInUsername: '',
      signInPassword: '',
      signUpUsername: '',
      signUpEmail: '',
      signUpPassword: '',
      error:false,
    };
  },
  mounted(){
   const token = localStorage.getItem('token')
  //  if(token){

  //   this.$router.push('/mainLayout')
  //  }
  },
// beforeUnmount(){
//   localStorage.removeItem('token')
// },
  methods: {
    toggleForm() {
      this.isSignIn = !this.isSignIn;
    },
     isValidEmail(email) {
      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(emailRegex.test(email)){
        this.error= false
      } else{
        this.error= true
      }

    },
     async signIn() {
      if (this.signInUsername.trim() !== '' && this.signInPassword.trim() !== '') {
        try {
          // const response = await axios.post('http://localhost:3000/signin', {
          //   username: this.signInUsername,
          //   password: this.signInPassword,
          // });

      //     const token = response.data.token
      //   console.log("back end :" + token)
      //  localStorage.setItem('token', token);

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        user => user.username === this.signInUsername && user.password === this.signInPassword
      );
      if(user){
        localStorage.setItem('token', JSON.stringify({ username: user.username, loggedIn: true }));
        this.$q.notify({
            type: 'positive',
            message: 'Login Successfully!',
          });

          // this.$q.notify({
          //   type: 'positive',
          //   message: 'Login Successfully!',
          // });

          this.$router.push('/mainLayout');
          this.signInUsername = '';
          this.signInPassword = '';
        }
        else{
          this.$q.notify({
          type: 'negative',
          message: 'User Not Exist',
        });

        }
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response.data.message || 'An error occurred while signing in.',
          });
        }
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Please Fill All Fields',
        });
      }
    },
    async signUp() {
      if (this.signUpUsername.trim() !== '' && this.signUpPassword.trim() !== '' && this.signUpEmail.trim() !== '') {
        if (!this.error) {
          try {
            // const response = await axios.post('http://localhost:3000/signup', {
            //   username: this.signUpUsername,
            //   email: this.signUpEmail,
            //   password: this.signUpPassword,
            // });
            const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === this.signUpUsername || user.email === this.signUpEmail);
          if(!userExists){
           users.push({
            username: this.signUpUsername,
            email: this.signUpEmail,
            password: this.signUpPassword,

           })
          localStorage.setItem('users', JSON.stringify(users))

            this.$q.notify({
              type: 'positive',
              message: 'Signup Successfully! Please sign in.',
            });
          }
            this.signUpUsername = '';
            this.signUpPassword = '';
            this.signUpEmail = '';
            this.toggleForm();
          } catch (error) {
            this.$q.notify({
              type: 'negative',
              message: error.response.data.message || 'An error occurred while signing up.',
            });
          }
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'Please enter a valid email',
          });
        }
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Please Fill All Fields',
        });
      }
    },

  }
};
</script>

<style>
@media screen and  (max-width: 500px) {
  .auth-container {
    width: 100%;
    height: auto;
    border-radius: 0;
    display: flex;
  }

  .auth-form {
     max-width: 100%;
    position: relative;
    transform: none;
    z-index: 1; /* Make sure it appears above the slide content */
  }

  .auth-slide {
    visibility: hidden;
  }

  .form-content {
    width: 100%; /* Ensure form content takes full width */
    padding: 0 20; /* Add padding for better alignment */
  }

  .slide-content {
    display: none; /* Ensure slide content is hidden */
  }

  /* Ensure these transform properties are applied for smaller screens */
  .slide-left.auth-form {
    transform: translateX(0) !important;
  }

  .slide-right.auth-form {
    transform: translateX(0) !important;
  }

  .slide-left.auth-slide {
    transform: translateX(0) !important;
  }

  .slide-right.auth-slide {
    transform: translateX(0) !important;
  }
}

.error-message {
  margin-left: -45px;
  color: rgb(247, 240, 239);
}

.auth-container {
  width: 700px;
  height: 500px;
  background-color: rgba(240, 248, 255, 0.2);
  border: 1px solid rgb(107, 99, 99);
  border-radius: 30px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.auth-form,
.auth-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s ease;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
}

.auth-form {
  background-color: transparent;
  z-index: 1;
  left: 0;
}

.auth-slide {
  background-color: rgba(240, 248, 255, 0.9);
  z-index: 2;
  right: 0;
}

.slide-left.auth-form {
  transform: translateX(100%);
}

.slide-right.auth-form {
  transform: translateX(0);
}

.slide-left.auth-slide {
  transform: translateX(-100%);
}

.slide-right.auth-slide {
  transform: translateX(0);
}

.form-content,
.slide-content {
  text-align: center;
  width: 75%;
}

.full-width {
  max-width: 50%;
  margin-top: 20px;
}

.background-color-add {
  background-image: url('/loginBackground.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}

.field {
  margin-top: 10px;
  border-radius: 10px;
}

.q-field__control {
  height: 45px;
  width: 250px;
  border: 1px solid rgb(114, 22, 175);
  color: rgb(114, 22, 175);
}

.q-field__label {
  left: 0;
  top: 10px;
  max-width: 100%;
}

</style>
