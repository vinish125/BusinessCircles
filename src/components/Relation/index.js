import React from 'react'
import './index.css'

export default ({relation}) => (
  <div className="relation">
    {
      relation
        .map( user => React.Children.toArray([
          <a
            className="relation--user"
            href={ `https://vk.com/id${ user.uid }` }
            target="_blank"
          >
            <img className="relation--avatar" src={ user.photo_medium } alt="" />
            <div className="relation--name">
              { user.first_name } { user.last_name }
            </div>
          </a>,
          <div className="relation--arrow">
            &gt;
          </div>
        ]) )
    }
    <span className="relation--user">
      <div className="relation--name">
        Ты
      </div>
    </span>
  </div>
)
