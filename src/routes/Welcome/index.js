import React from 'react'
import './index.css'

import * as api from '../../utils/api'

import { name } from '../../../package.json'

export default class Welcome extends React.PureComponent {

  login = async (e) => {
    e.preventDefault()

    try {
      const response = await api.init()
      this.props.onLogin(response.session.user)
      console.warn(response)
    } catch(e) {
      if(e instanceof Error) {
        console.error(e)
        alert('Приложение сломалось. Совсем. Иди, чини.')
      } else {
        alert('Ошибка авторизации: ' + e)
        console.warn(e)
      }
    }
  }

  render() {
    return (
      <div className="welcome">
        <h1 className="welcome--text">
          Добро пожаловать в { name }!
        </h1>
        <div className="welcome--intro">
          Здесь ты сможешь найти, кто из твоих знакомых работает в интересующей компании.
          <br /><br />
          Но сперва, ты должен
        </div>
        <button className="welcome--login-btn" onClick={ this.login }>
          Авторизоваться Вконтакте
        </button>
      </div>
    )
  }
}
