import Taro, { Component } from '@tarojs/taro'
import { MovableArea, MovableView } from '@tarojs/components'
import Btn from '../../../../components/Btn/Btn'
import UIcon from '../../../../components/UIcon/UIcon'
import './FixedBtn.scss'

export default class FixedBtn extends Component {
  navToAdd = () => {
    Taro.navigateTo({
      url: '/subpackages/timetable/pages/activity-search/activity-search',
    })
  }

  render() {
    return (
      <MovableArea className="movable-area">
        <MovableView
          className="movable-view"
          direction="all"
          inertia
          outOfBounds
        >
          <Btn type="primary" shape="round" ripple onClick={this.navToAdd}>
            <UIcon icon="add" />
          </Btn>
        </MovableView>
      </MovableArea>
    )
  }
}
