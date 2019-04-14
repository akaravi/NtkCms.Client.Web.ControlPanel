import React from 'react'
import DatePicker from 'material-ui/DatePicker'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import persianUtils from 'material-ui-persian-date-picker-utils'
let theme = getMuiTheme({
  fontFamily: 'IRANSans',
  borderRadius: 2,
  flatButton: {
    primaryTextColor: '#5b5b5b'
  },
  datePicker: {
    color: '#444444',
    textColor: '#ffffff',
    calendarTextColor: '#444444',
    selectColor: '#2a93d5',
    selectTextColor: '#ffffff',
    calendarYearBackgroundColor: 'white',
    headerColor: '#2a93d5'
    }
})
theme.baseTheme.fontFamily = 'IRANSans'
theme.isRtl = true

export default class extends React.Component {
  focus () {
    this.refs.el.focus()
  }
  render () {
    let props = this.props
    return (
      <MuiThemeProvider muiTheme={theme}>
        <DatePicker
          {...props}
          utils={persianUtils}
          ref='el'
          DateTimeFormat={global.Intl.DateTimeFormat}
          locale='fa-IR'
          firstDayOfWeek={6}
        />
      </MuiThemeProvider>
    )
  }
}
