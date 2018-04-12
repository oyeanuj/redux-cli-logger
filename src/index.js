'use strict'

const chalk = require("chalk")

// gets top level keys and prints them in format
const topLevel = (obj, rightArrow) => {
  let formatted = ''
  Object.keys(obj).forEach(key => {
    if (key.length > 0) {
      formatted += `${rightArrow} ${key} `
    }
    if (obj.hasOwnProperty(key)) {
      formatted += `${JSON.stringify(obj[key])}\n`
    }
  })

  return formatted
}

const renderToConsole = (obj, rightArrow) => {
  try {
    return topLevel(obj, rightArrow)
  } catch (e) {
    return obj
  }
}

export default function createCLILogger (options) {
  const {
    downArrow = '▼',
    rightArrow = '▶',
    messageColor = 'yellow',
    prevColor = 'grey',
    actionColor = 'blue',
    nextColor = 'green',
    predicate = null,
    stateTransformer = (x) => x,
    actionTransformer = (x) => x
  } = options

  return store => next => action => {
    const {getState} = store

    if (predicate && !predicate(getState, action)) {
      return next(action)
    }

    if (typeof console === 'undefined') {
      return next(action)
    }

    const prevState = renderToConsole(stateTransformer(getState()), rightArrow)
    const actionDisplay = renderToConsole(actionTransformer(action), rightArrow)
    const returnValue = next(action)
    const nextState = renderToConsole(stateTransformer(getState()), rightArrow)
    const time = new Date()

    const message = `\n${downArrow} Action :: ${chalk.bold(action.type)} @ ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`

    const output = `${chalk[messageColor](message)}\n` +
      `  ${chalk[prevColor](chalk.bold.underline('PREVIOUS STATE'), `\n${prevState}`)}` +
      `  ${chalk[actionColor](chalk.bold.underline('ACTION'), `\n${actionDisplay}`)}` +
      `  ${chalk[nextColor](chalk.bold.underline('NEXT STATE'), `\n${nextState}`)}`

    console.log(output)
    return returnValue
  }
}
