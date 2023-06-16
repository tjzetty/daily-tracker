import React from 'react';

function SignIn({ firebase, auth }) {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <p>Are you ready to start building healthy habits?</p>
    </>
  );
}

function SignOut({ auth }) {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
}

export { SignIn, SignOut };
