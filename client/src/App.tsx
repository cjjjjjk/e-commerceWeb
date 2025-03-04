import {Suspense, lazy, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Redux tollkit
import { useDispatch } from 'react-redux';
import { setHeaderTheme } from 'shared/header/headerSlice';
import { setNaviToBackHome } from 'shared/navi/navigateSlice';

// Components
import Header from './shared/header/Header';
import Navigate from './shared/navi/Navigate';
import { Loading } from './shared/components';
// Pages - lazy loading.
const Women = lazy(()=> import('./pages/Women/Women'));
const Men = lazy(()=> import('./pages/Men/Men'));
const Member = lazy(()=> import('./pages/Member/Member'));
const SignIn = lazy(()=> import('./pages/SignIn/SignIn'));
const Wishlist = lazy(()=> import('./pages/Wishlist/Wishlist'));
const Cart = lazy(()=> import('./pages/Cart/Cart'))

const RouteChangeHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    switch (location.pathname) {
      case "/member":
        dispatch(setHeaderTheme("light"));
        dispatch(setNaviToBackHome(true));
        break;
      case "/cart":
        dispatch(setHeaderTheme("light"));
        dispatch(setNaviToBackHome(false));
        break;
      case "/wishlist":
        dispatch(setHeaderTheme("light"));
        dispatch(setNaviToBackHome(false));
        break;
      case "/signin":
        dispatch(setHeaderTheme("light"));
        dispatch(setNaviToBackHome(true));
        break;
      default:
        dispatch(setHeaderTheme("dark"));
        dispatch(setNaviToBackHome(false));
    }
  }, [location, dispatch]);
  return null;
};
function App() {

  return (
    <Router>
      <Header></Header>
      <RouteChangeHandler />
      <Suspense 
        fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={<Women />} />
          <Route path="/men" element={<Men />} />
          <Route path='/member' element={<Member />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="*" element={<Women />} />
        </Routes>
      </Suspense>
      <Navigate></Navigate>
    </Router>
  );
}

export default App;
