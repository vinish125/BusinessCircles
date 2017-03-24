// Уровень прав доступа
// https://vk.com/dev/permissions
const PERMISSIONS_SCOPE = 2

// https://vk.com/dev/errors
const FLOOD_ERROR_CODES = [6, 9, 10, 14]
const NOT_A_USER_ERROR_CODES = [7, 15, 18, 113]

const DELAY_BETWEN_REQUEST = 300

const { VK } = window

export function init() {
  return new Promise((resolve, reject) => {
      VK.init({
        apiId: 5944932
      })

      VK.Auth.login((response) => {
        if(response.status) {
          resolve(response)
        } else {
          reject(response)
        }
      }, PERMISSIONS_SCOPE)
  })
}

function execApiCall(method, params) {
  return new Promise((resolve, reject) => {
    VK.Api.call(method, params, ({ response, error }) => {
      if(response) {
        if(Array.isArray(response) && typeof response[0] === 'number') {
          resolve(response.slice(1))
        } else {
          resolve(response)
        }
      } else {
        const { error_msg = error, error_code = 0 } = error
        if(
          !FLOOD_ERROR_CODES.includes(Number(error_code)) &&
          !NOT_A_USER_ERROR_CODES.includes(Number(error_code))
        ) {
          alert('Ошибка API: ' + error_msg)
          console.error(error)
        }

        reject(error)
      }
    })
  })
}

let promisesQueue = Promise.resolve()

export function call(method, params = {}) {
  let requestStartTime;

  const promise = promisesQueue
    .then(() => requestStartTime = Number(Date.now()))
    .then(() => execApiCall(method, params))
    .catch(e => {
      if(FLOOD_ERROR_CODES.includes(Number(e.error_code))) {
        return delay(1000).then(() => execApiCall(method, params))
      } else {
        return Promise.reject(e)
      }
    })


  promisesQueue = promise
    .catch(() => {})
    .then(() => {
      const left = Math.max(
        DELAY_BETWEN_REQUEST - (Number(Date.now()) - requestStartTime),
        0
      )

      return delay(left)
    })
  return promise
}

function delay(time = 100) {
  return new Promise(resolve => setTimeout(resolve, time))
}
