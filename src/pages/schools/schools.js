import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Navigation from '../../components/Navigation/Navigation'
import Loading from '../../components/Loading/Loading'
import SchoolCard from './components/SchoolCard/SchoolCard'
import RecentEvals from './components/RecentEvals/RecentEvals'
import api from '../../utils/api'

import './schools.scss'

export default class Schools extends Component {
  state = {
    schools: [[], []],
    isFinished: false,
    count: 0,
  }

  componentWillMount() {
    this.fetchSchools()
  }

  fetchSchools = async () => {
    const res = await api.Exchanges.browse()

    // for cascade
    const arrs = [[], []]
    res.forEach((school, i) => {
      arrs[i % 2].push(school)
    })

    this.setState({ schools: arrs, count: res.length, isFinished: true })
  }

  navToSchool = id => {
    Taro.navigateTo({
      url: `/subpackages/exchange/pages/school/school?id=${id}`,
    })
  }

  render() {
    return (
      <View className="schools-page">
        <Navigation title={Taro.T._('Exchange Universities')} />

        <View className="field">
          <View className="title">{Taro.T._('Recent Evaluations')}</View>
          <RecentEvals />
        </View>

        <View className="field">
          <View className="title">{Taro.T._('Schools')}</View>
          <View className="cascades">
            {this.state.schools.map((arr, i) => (
              <View className="cascade" key={`school-list-${arr[0].id}`}>
                {arr.map(school => (
                  <View
                    key={school.id}
                    onClick={this.navToSchool.bind(this, school.id)}
                  >
                    <SchoolCard
                      title={school.title}
                      country={school.country}
                      exchange={school.exchange}
                      studyAbroad={school.study_abroad}
                      nomination={school.nomination}
                      nominationDeadline={school.nomination_deadline}
                      application={school.application}
                      applicationDeadline={school.application_deadline}
                      agreementType={school.agreement_type}
                      englishProficiency={school.english_proficiency}
                      notes={school.notes}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>

          {this.state.isFinished ? (
            <View className="count">{`${Taro.T._('Found')} ${
              this.state.count
            } ${Taro.T._('universities')}`}</View>
          ) : (
            <Loading color="primary" />
          )}
        </View>
      </View>
    )
  }
}
