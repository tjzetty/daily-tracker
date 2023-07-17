import '../App.css';

function SignIn({ firebase, auth, analytics }) {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    analytics.logEvent('login');
  };

  return (
    <>
      <button className='login-with-google-btn' onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>Are you ready to start building healthy habits?</p>
    </>
  );
}

function SignOut({ auth }) {
  return auth.currentUser && (
    <button 
      href="#" 
      className='logoutStyles' 
      onClick={() => auth.signOut()} 
    >
      Sign Out
    </button>
  );
}

export { SignIn, SignOut };
