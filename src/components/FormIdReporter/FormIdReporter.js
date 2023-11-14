import Taro, { Component } from '@tarojs/taro'
import { Button, Form } from '@tarojs/components'

import './FormIdReporter.scss'

export default class FormIdReporter extends Component {
  handleSubmit = e => {
    const { formId } = e.detail
    console.log(formId)
  }

  render() {
    return (
      <Form reportSubmit onSubmit={this.handleSubmit}>
        <Button plain formType="submit" hoverClass="none">
          {this.props.children}
        </Button>
      </Form>
    )
  }
}
