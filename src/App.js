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

const taskConverter = {
  toFirestore(task) {
      return {
          name: task.name,
          timesPerWeek: task.timesPerWeek,
          createdAt: task.createdAt,
          checks: task.checks,
          uid: task.uid,
      }
  },
  fromFirestore(snapshot, options) {
      const data = snapshot.data(options)
      return {
          id: snapshot.id,
          name: data.name,
          timesPerWeek: data.timesPerWeek,
          createdAt: data.createdAt,
          checks: data.checks,
          uid: data.uid,
      }
  },
}

const calendarConverter = {
  toFirestore(calendar) {
      return {
          day: calendar.day,
          tids: calendar.tids,
          uid: calendar.uid,
      }
  },
  fromFirestore(snapshot, options) {
      const data = snapshot.data(options)
      return {
          id: snapshot.id,
          day: data.day,
          tids: data.tids,
          uid: data.uid,
      }
  },
}

function App() {
  const [user] = useAuthState(auth);
  const tasksRef = firestore.collection('tasks').withConverter(taskConverter);
  const calendarRef = firestore.collection('calendar').withConverter(calendarConverter);

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
              calendarRef={calendarRef}
              firebase={firebase}
            />
          </div>
        ) : (
          <SignIn firebase={firebase} auth={auth} analytics={analytics}/>
        )}
      </header>
    </div>
  );
}

function TaskTable({ user, tasksRef, calendarRef, firebase }) {
  const taskQuery = tasksRef.where('uid', '==', user.uid).orderBy('createdAt');
  const [dbtasks, loadingTasks] = useCollectionData(taskQuery, { idField: 'id' });
  const calQuery = calendarRef.where('uid', '==', user.uid);
  const [dbcal, loadingCal] = useCollectionData(calQuery, { idField: 'id' });

  if (loadingTasks || loadingCal) {
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
      <Tasks analytics={analytics} tasks={dbtasks} user={firebase.auth().currentUser.uid} tasksRef={tasksRef} firebase={firebase}/>
      <Calendar analytics={analytics} tasks={dbtasks} dbcal={dbcal} user={firebase.auth().currentUser.uid} tasksRef={tasksRef} calendarRef={calendarRef}/>
      <Goals tasks={dbtasks} />
    </div>
  );
}

export default App;
