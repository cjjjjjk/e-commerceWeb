import {Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Header from './shared/header/Header';
import Navigate from './shared/navi/Navigate';
import { Loading } from './shared/components';
// Pages - lazy loading.
const Home = lazy(()=> import('./pages/Home/Home'))
const Member = lazy(()=> import('./pages/Member/Member'))
const SignIn = lazy(()=> import('./pages/Signin/Signin'))

function App() {

  return (
    <Router>
      <Header></Header>
      <Suspense 
        fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/member' element={<Member />} />
          <Route path='/signin' element={<SignIn />} />
        </Routes>
      </Suspense>
      <Navigate></Navigate>
    </Router>
  );
}

export default App;
