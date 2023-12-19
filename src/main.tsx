import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import "./CSS/styles.css"
import HomePage from './HomePage.tsx'
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import 'bootswatch/dist/zephyr/bootstrap.min.css'
import Header from './components/Header.tsx';
import MoviesPage from './components/MoviesPage.tsx';
import MovieInfo from './components/MovieInfo.tsx';
import { LastPageContextProvider } from './LastPageContext.tsx';
import { SavedMoviesContextProvider } from './SavedMoviesContext.tsx';
import OnlyMoviesPages from './components/OnlyMoviesPages.tsx';
import 'react-loading-skeleton/dist/skeleton.css'
import { ToastContainer } from 'react-toastify';
import "react-toastify/ReactToastify.css"

function ScrollToTop () {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando la ruta cambia, reinicia el scroll
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LastPageContextProvider>
      <SavedMoviesContextProvider>
        <HashRouter>
          <ScrollToTop/>
          <ToastContainer
            position="top-right"
            autoClose={1400}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Header/>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/movies' element={<MoviesPage/>}/>
            <Route path='/movie/:movie_id' element={<MovieInfo/>}/>
            <Route path='/saved/:page' element={<OnlyMoviesPages pageType='saved'/>}/>
            <Route path='/category/:category_id/:page' element={<OnlyMoviesPages pageType='category'/>}/>
            <Route path='/search/:query/:page' element={<OnlyMoviesPages pageType='search'/>}/>
            <Route index path='/movies/:movie_list_name/:page' element={<OnlyMoviesPages pageType='movieList'/>}/>
            <Route path='/recommendations/:movie_id/:page' element={<OnlyMoviesPages pageType='recommended'/>}/>
            <Route path='/casting/:movie_id/:page' element={<OnlyMoviesPages pageType='casting'/>}/>
          </Routes>
        </HashRouter>
      </SavedMoviesContextProvider>
    </LastPageContextProvider>
  </React.StrictMode>,
)
