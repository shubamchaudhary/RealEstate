import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import ListingItem from './components/ListingItem';
import EditListing from './pages/EditListing';
import Listing from './pages/Listing';
import Category from './pages/Category';

function App() {
  return (
    <>
   <Router>
    <Header />
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/offers' element={<Offers />}></Route>
      <Route path='/category/:categoryName' element={<Category />}></Route>
      <Route path="/create-listing" element={<PrivateRoute />}>
      <Route path='/create-listing' element={<CreateListing />}></Route>
      </Route>
      <Route path="/edit-listing" element={<PrivateRoute />}>
      <Route path="/edit-listing/:listingId" element={<EditListing />}></Route>
      </Route>
      <Route path='/category/:categoryName/:listingId' element={<Listing />}/>
      <Route path='/sign-in' element={<SignIn />}></Route>
      <Route path='/sign-up' element={<SignUp />}></Route>
      <Route path='/forgot-password' element={<ForgotPassword />}></Route>
      <Route path="/profile" element={<PrivateRoute />}>
      <Route path='/profile' element={<Profile />}></Route>
      </Route>
    </Routes>
   </Router>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
      />
   </>
  );
}

export default App;
