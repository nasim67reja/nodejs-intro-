/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

axios.defaults.withCredentials = true;

export const login = async (email, password) => {
  // try {
  //   const res = await axios({
  //     method: 'POST',
  //     url: 'http://127.0.0.1:3000/api/v1/users/login',
  //     data: {
  //       email,
  //       password
  //     }
  //   });

  //   // if (res.data.status === 'success') {
  //   //   showAlert('success', 'Logged in successfully!');
  //   //   window.setTimeout(() => {
  //   //     location.assign('/');
  //   //   }, 1500);
  //   // }
  //   console.log(res);
  // } catch (err) {
  //   showAlert('error', err.response.data.message);
  // }

  try {
    const { data } = await axios.post(
      'http://127.0.0.1:3000/api/v1/users/login',
      {
        email,
        password
      }
      // withCredentials: true,
    );
    // enter you logic when the fetch is successful
    console.log(`data: `, data);
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)
    console.log(`error: `, error);
  }
};
document.querySelector('.form').addEventListener('submit', e => {
  console.log('hello');
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: 'http://127.0.0.1:3000/api/v1/users/logout'
//     });
//     if ((res.data.status = 'success')) location.reload(true);
//   } catch (err) {
//     console.log(err.response);
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };
