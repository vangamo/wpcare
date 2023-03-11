import { useState } from 'preact/hooks'

import Header from './layout/header'
import Menu from './layout/menu'
import Sites from './pages/sites/sites'
import './app.css'

export function App() {
  return (
    <>
      <Header/>
      <Menu/>
      <main className="main">
        <Sites/>
      </main>
    </>
  )
}
