'use strict'

import RenderKid from 'renderkid'

// gets top level keys and prints them in format
const topLevel = (obj, rightArrow) => {
  let formatted = ''
  Object.keys(obj).forEach(key => {
    if (key.length > 0) {
      formatted += `<label>${rightArrow} ${key}</label>`
    }
    if (obj.hasOwnProperty(key)) {
      formatted += `<pre>${JSON.stringify(obj[key])}</pre>`
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
    rightArrow = '',
    messageColor = 'bright-yellow',
    prevColor = 'grey',
    actionColor = 'bright-blue',
    nextColor = 'green',
    predicate = null,
    stateTransformer = (x) => x,
    actionTransformer = (x) => x
  } = options

  const kid = new RenderKid()
  kid.style({
    'label': {},
    'list': {
      marginLeft: '1'
    },
    'li': {
      marginLeft: '2'
    },
    'pre': {
      marginLeft: '4',
      display: 'block'
    },
    'message': {
      display: 'block',
      color: messageColor
    },
    'prev': {
      color: prevColor
    },
    'action': {
      color: actionColor
    },
    'next': {
      color: nextColor
    }
  })

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

    const message = `${downArrow} action ${action.type} @ ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`

    const output = kid.render(`
      <message>
        ${message}
      </message>
      <ul>
        <li><prev>prev state</prev></li>
        <pre><prev>${prevState}</prev></pre>

        <li><action>action</action></li>
        <pre><action>${actionDisplay}</action></pre>

        <li><next>next</next></li>
        <pre><next>${nextState}</next></pre>
      </ul>
    `)

    console.log(output)
    return returnValue
  }
}
