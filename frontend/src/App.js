import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Subscription from "./components/Subscription";
import Navbar from "./components/Navbar";
import PhonePaySubscription from "./components/PhonePaySubscription";
import Cashfree from "./components/Cashfree";

function App() {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar currentPage={currentPage} />

        <Routes>
          <Route path="/" element={<Subscription />} />
          <Route path="/cashfree" element={<Cashfree />} />
          <Route path="/phonepe" element={<PhonePaySubscription />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
