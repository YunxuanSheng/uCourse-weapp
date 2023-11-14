import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './CourseList.scss'

export default class CourseList extends Component {
  static defaultProps = {
    courses: [],
  }

  navToCourse = (title, code, school_code) => {
    // title, school_code are for cache
    Taro.navigateTo({
      url: `/subpackages/course/pages/course/course?title=${title}&code=${code}&school_code=${school_code}`,
    })
  }

  render() {
    return (
      <View className="course-list">
        {this.props.courses.map(c => (
          <View
            key={c.code}
            className={`course ${c.belongsTo.code}`}
            onClick={this.navToCourse.bind(
              this,
              c.title,
              c.code,
              c.belongsTo.code
            )}
          >
            <View className="title">{`${c.title} (${c.code})`}</View>
            <View className="tag">
              {`Lv.${c.level} · `}
              {c.semester.replace(' China', '')}
            </View>
          </View>
        ))}
      </View>
    )
  }
}
