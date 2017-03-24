import React from 'react'
import _debounce from 'lodash/debounce'

import './index.css'

import Company from '../../components/Company'
import * as api from '../../utils/api'

export default class Search extends React.PureComponent {
  _input = null
  state = {
    items: []
  }

  onChange = _debounce(async (e) => {
    if(!this._input) {
      // Component was already unmounted
      return;
    }

    const { value: q } = this._input
    const items = await api.call('groups.search', { q }) || []
    this.setState({ items })
  }, 1000)

  onSubmit = (e) => {
    e.preventDefault()
    this.props.onCompanyFound(this._input.value)
  }

  onSelect = (item) => {
    this.props.onCompanyFound(item.name)
  }

  render() {
    const { items } = this.state

    return (
      <div className="search">
        <form className="search--form" onSubmit={ this.onSubmit }>
          <input
            ref={ ref => this._input = ref }
            className="search--input"
            placeholder="Название компании"
            onChange={ this.onChange } />
          <button className="search--submit">
            Найти
          </button>
        </form>

        {
          items.map( item => (
            <Company { ...item } onClick={ this.onSelect.bind(this, item) } key={ item.gid } />
          ))
        }
      </div>
    )
  }
}
