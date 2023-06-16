import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './App.css';

import { SignIn, SignOut } from './components/auth';
import Calendar from './components/calendar';
import Tasks from './components/tasks';
import Goals from './components/goals';


firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {
  const [user] = useAuthState(auth);
  const tasksRef = firestore.collection('tasks');

  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const formattedDate = today.toLocaleString('en-US', { month: 'long' }) + ' \'' + year;

  return (
    <div className="App">
      <header className="App-header">
        <SignOut auth={auth} />
        {user ? (
          <div>
            <img src={user.photoURL} alt="profile" />
            <h1>{formattedDate}</h1>
            <TaskTable
              user={user}
              tasksRef={tasksRef}
              firebase={firebase}
            />
          </div>
        ) : (
          <SignIn firebase={firebase} auth={auth} />
        )}
      </header>
    </div>
  );
}

function TaskTable({ user, tasksRef, firebase }) {
  const query = tasksRef.where('uid', '==', user.uid).orderBy('createdAt');
  const [dbtasks, loadingTasks] = useCollectionData(query, { idField: 'id' });

  if (loadingTasks) {
    return (
      <div className="flex-container">
        <Tasks tasks={[]} />
        <Calendar tasks={[]} />
        <Goals tasks={[]} />
      </div>
    );
  }

  return (
    <div className="flex-container">
      <Tasks tasks={dbtasks} user={firebase.auth().currentUser.uid} db={tasksRef} firebase={firebase} />
      <Calendar tasks={dbtasks} />
      <Goals tasks={dbtasks} />
    </div>
  );
}

export default App;
