import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Register from './components/Register';
import Home from './components/Home';
import Rides from './components/Rides';
import withProtectedRoute from './components/withProtectedRoute';
import withProtectedInRoute from './components/withProtectedInRoute';
import withNoAuth from './components/withNoAuth';
import { AuthProvider } from './AuthContext';
import Profile from './components/Profile';
import PostRide from './components/PostRide';
import OfferRide from './components/OfferRide';
import Ride from './components/Ride';
import History from './components/History';
import Tickets from './components/Tickets';
import SellTicket from './components/SellTicket';

function App() {
  const NoAuthSignIn = withNoAuth(Signin);
  const NoAuthRegister = withNoAuth(Register);

  const ProtectedRides = withProtectedRoute(Rides);
  const ProtectedProfile = withProtectedRoute(Profile);
  const ProtectedPostRide = withProtectedRoute(PostRide);
  const ProtectedOfferRide = withProtectedRoute(OfferRide);
  const ProtectedHistory = withProtectedRoute(History);
  const ProtectedTickets = withProtectedRoute(Tickets);
  const ProtectedRide = withProtectedInRoute(Ride);
  const ProtectedSellTicket = withProtectedRoute(SellTicket);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<NoAuthSignIn />} />
          <Route path="/register" element={<NoAuthRegister />} />
          <Route path="/rides" element={<ProtectedRides />} />
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="/postride" element={<ProtectedPostRide />} />
          <Route path="/offerride" element={<ProtectedOfferRide />} />
          <Route path="/ride" element={<ProtectedRide />} />
          <Route path="/history" element={<ProtectedHistory />} />
          <Route path="/tickets" element={<ProtectedTickets />} />
          <Route path="/sellticket" element={<ProtectedSellTicket />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
