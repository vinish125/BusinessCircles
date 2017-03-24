import React from 'react'
import Relation from '../../components/Relation'
import './index.css'

import * as api from '../../utils/api'

const MAX_SEARCH_DEPTH = 3

export default class Activity extends React.PureComponent {
  state = {
    inProgress: true,
    friends: [],
    relations: [],
    peopleInCircles: 0,
    checked: 0,
    depth: 1,
  }

  addPeople(amount) {
    this.setState({
      peopleInCircles: this.state.peopleInCircles + amount
    })
  }

  addChecked(amount = 1) {
    this.setState({
      checked: this.state.checked + amount
    })
  }

  async walkUsersFriends(relations) {
    let nextFriendsLayer = []

    this.addPeople(relations.length)

    for(const relation of relations) {
      try {
        const employee = relation[ relation.length - 1 ]
        const employeeFriends = await api.call('friends.get', {
          fields: 'photo_medium',
          user_id: employee.uid,
        })

        for(const employeeFriend of employeeFriends) {
          if(this.state.friends.indexOf(employeeFriend.uid) !== -1) {
            this.state.relations.push([ ...relation, employeeFriend ])
          } else {
            nextFriendsLayer.push([ ...relation, employeeFriend ])
          }
        }

        this.setState({
          checked: this.state.checked + 1,
          relations: this.state.relations.slice(0)
        })
      } catch(e) {
        const relationStr = relation
          .map( user => `${ user.first_name } ${ user.last_name } (id${ user.uid })` )
          .join( ' -> ' )

        console.warn(`Problem with user ${ relationStr }: `, e)
      }
    }

    const nextLayerDepth = (nextFriendsLayer[0] && nextFriendsLayer[0].length) || 0
    if(nextLayerDepth < MAX_SEARCH_DEPTH) {
      this.setState({
        depth: nextLayerDepth
      })
      await this.walkUsersFriends(nextFriendsLayer)
    }
  }

  async componentDidMount() {
    const { company } = this.props

    try {
      const friends = await api.call('friends.get')
      const friendsInCompany = await api.call('users.search', {
        company,
        fields: 'photo_medium',
        from_list: 'friends',
      }) || []
      this.setState({
        relations: friendsInCompany.map( (employee) => ([ employee ]) ),
        friends,
      })

      const employees = await api.call('users.search', {
        company,
        fields: 'photo_medium',
        count: 1000
      }) || []

      await this.walkUsersFriends(
        employees
          .filter( employee => {
            /* eslint-disable eqeqeq */
            if(employee.uid == this.props.user.id) {
              return false
            }
            /* eslint-enable eqeqeq */
            if(this.state.friends.indexOf(employee.uid) !== -1) {
              return false;
            }

            return true;
          } )
          .map( (employee) => ([ employee ]) )
      )


    } catch(e) {
      if(e instanceof Error) {
        console.error(e)
        alert('Приложение сломалось. Совсем. Иди, чини.')
      } else {
        alert('Ошибка поиска: ' + e)
        console.warn(e)
      }
    } finally {
      this.setState({
        inProgress: false
      })
    }
  }

  render() {
    const { inProgress, relations } = this.state

    return (
      <div className="results">
        <div className="results--header">
          <span>
            {
              inProgress ? (
                'Поиск запущен  🔍'
              ) : (
                null
              )
            }
          </span>
          <span>
            Рукопожатий в поиске: { this.state.depth + 1 }
          </span>
          <span>
            { this.state.checked } / { this.state.peopleInCircles }
          </span>
        </div>

        {
          relations.map( relation => (
            <Relation relation={relation} key={ relation.map( user => user.uid ).join('.') }/>
          ) )
        }
      </div>
    )
  }
}
