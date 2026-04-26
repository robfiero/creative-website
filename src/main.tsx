import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import App from './App'
import './index.css'
import AboutPage from './pages/AboutPage'
import CollectionPage from './pages/CollectionPage'
import HomePage from './pages/HomePage'
import PiecePage from './pages/PiecePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="collections/:slug" element={<CollectionPage />} />
          <Route path="piece/:slug" element={<PiecePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
