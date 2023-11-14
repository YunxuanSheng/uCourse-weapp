import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UIcon from '../../components/UIcon/UIcon'
import Navigation from '../../components/Navigation/Navigation'
import ContentCard from './components/ContentCard/ContentCard'
import api from '../../utils/api'
import './careers.scss'

const orderList = ['最新发布', '最多浏览', '最多赞']
const orderCompList = [
  (a, b) => (a._id > b._id)?(-1):(1),
  (a, b) => -(a.views - b.views),
  (a, b) => -(a.likes - b.likes)
]

export default class Careers extends Component {
  state = {
    tab: 0,
    order: 0,
    filter: null,
    showSearch: false,

    posts: [],
  }

  componentDidMount = () => {
    this.openTab(0)
  }

  openTab = async (tab) => {
    const data = await api.Careers.browse(tab)

    this.setState({
      tab: tab,
      posts: data
    })
  }

  onOrderChange = (evt) => {
    this.setState({
      order: evt.detail.value
    })
  }

  onClickSearch = () => {
    this.setState({
      showSearch: true
    })
  }

  render = () => {
    return (
      <View className="careers-page">
        {/*<Navigation align="center">
          <View className="search-nav-comp" onClick={this.onClickSearch}>
            <UIcon icon-class="icon" icon="search-o" />
            {Taro.T._('Search')}
          </View>
        </Navigation>*/}

        <Navigation title="升学就业" />

        <View className="tabs">
          <View className={this.state.tab==0?"tab active":"tab"} onClick={()=>{this.openTab(0)}}>升学</View>
          <View className={this.state.tab==1?"tab active":"tab"} onClick={()=>{this.openTab(1)}}>就业</View>
        </View>

        <Picker
          mode="selector"
          range={orderList}
          onChange={this.onOrderChange}
        >
          <View className="order">{orderList[this.state.order]}<UIcon icon="unfold"></UIcon></View>
        </Picker>

        <View className="content-list">
          {(this.state.posts.length>0) ? (
            this.state.posts.sort(orderCompList[this.state.order]).map(post=>(
              <ContentCard key={post._id} post={post} />
            ))
          ):(
            <View className="hint">空空如也</View>
          )}
        </View>
      </View>
    )
  }
}
