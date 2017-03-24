import React from 'react'
import './index.css'

export default ({ name, photo_medium, onClick }) => (
  <div className="company" onClick={ onClick }>
    <img className="company--img" src={ photo_medium } alt=""/>
    <div className="company--name">
      { name }
    </div>
    <a href="#" className="company--link" onClick={ e => e.preventDefault() }>
      Выбрать
    </a>
  </div>
)
