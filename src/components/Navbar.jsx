import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gray-800 p-4">
    <div className="container mx-auto flex justify-between">
      <Link to="/" className="text-white text-lg">Home</Link>
      <Link to="/about" className="text-white text-lg">About</Link>
      <Link to="/contact" className="text-white text-lg">Contact</Link>
    </div>
  </nav>
);

export default Navbar;