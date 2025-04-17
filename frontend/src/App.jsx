// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
// import Home from './pages/Home';
// import BookListing from './pages/BookListing';
// import BookDetails from './pages/BookDetails';
// import Profile from './pages/Profile';
// import Login from './pages/Login';
// import Register from './pages/Register';

// function App() {
//   return (
//     <Router>
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/books" element={<BookListing />} />
//           <Route path="/books/:id" element={<BookDetails />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       </main>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BookListing from './pages/BookListing';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookListing />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
