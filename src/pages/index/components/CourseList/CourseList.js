import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './CourseList.scss'

export default class CourseList extends Component {
  static defaultProps = {
    courses: [
      {
        title: 'Your University Journey - Becoming an Independent Thinker',
        level: 'X',
        code: 'NAA1254',
        belongsTo: {
          code: 'UNNC',
          name: 'China',
        },
        objectId: '5b20d29eee920a003b0dacf7',
        createdAt: '2018-06-13T08:15:26.419Z',
        updatedAt: '2018-06-13T08:15:26.419Z',
      },
      {
        title: 'Your University Journey',
        level: 'X',
        code: 'NAA1270',
        belongsTo: {
          code: 'UNNC',
          name: 'China',
        },
        objectId: '5b20d3329f5454003b82be5b',
        createdAt: '2018-06-13T08:17:54.947Z',
        updatedAt: '2018-06-13T08:17:54.947Z',
      },
      {
        title: 'Workplace Discourse',
        level: '3',
        code: 'ENGL3089',
        belongsTo: {
          code: 'CSC-ENGL',
          name: 'School of English',
        },
        objectId: '5b20e572ee920a003b0f61a3',
        createdAt: '2018-06-13T09:35:46.152Z',
        updatedAt: '2018-06-13T09:35:46.152Z',
      },
    ],
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
            {/* FIXME: {`${c.title} ${c.code})`} */}
            <View className="title">{c.title + ' (' + c.code + ')'}</View>
          </View>
        ))}
      </View>
    )
  }
}
