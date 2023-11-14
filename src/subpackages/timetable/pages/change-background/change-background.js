import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Switch, Button } from '@tarojs/components'
import Navigation from '../../../../components/Navigation/Navigation'
import UIcon from '../../../../components/UIcon/UIcon'
import Btn from '../../../../components/Btn/Btn'
import api from '../../../../utils/api'
import { TaroCropper } from 'taro-cropper';

import './change-background.scss'



export default class Reminder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      background_url: Taro.getStorageSync("background_url"),
      src: "",
      showCropper: false,
      tableHeight: 740,
      tableWidth: 375
    }

  }

  componentWillMount() {
  }

  catTaroCropper = (node) => {
    this.taroCropper = node;
  }

  selectImg = async () => {
    try {
      Taro.vibrateShort()
      let tempFilePaths
      try {
        const res = await Taro.chooseImage({ count: 1 })
        tempFilePaths = res.tempFilePaths
      } catch (e) {
        throw new Error(Taro.T._('No image is selected'))
      }

      const systemInfo = await Taro.getSystemInfo();
      const tableHeight =
        (systemInfo.windowHeight -
        systemInfo.statusBarHeight -
        46);
      const tableWidth = systemInfo.screenWidth;
      this.setState({ 
        src: tempFilePaths[0],
        showCropper: true ,
        tableHeight,
        tableWidth
      });

      
      // const cutRes = await this.taroCropper.cut();

      // const tempImgPath = cutRes.filePath || tempFilePaths[0];

      // console.log(tempImgPath, tempFilePaths, cutRes)


    } catch (e) {
      // Taro.hideLoading()
      Taro.showToast({ title: e.message, icon: 'none' })
      console.error(e)
    }
  }

  uploadImg = async (tempImgPath) => {
    this.setState({ showCropper: false })
    // const tempImgPath = res.filePath;
    // console.log(res, tempImgPath)
    let picLink
    try {
      Taro.showLoading({ title: Taro.T._('Uploading image'), mask: true })
      const res = await api.Pic.upload(tempImgPath)
      Taro.hideLoading()
      picLink = res.data
    } catch (e) {
      throw new Error(Taro.T._('Uploading failed'))
    }

    Taro.setStorageSync('background_url', picLink);

    this.setState({
      background_url: picLink
    })
  }

  restore = async () => {
    const res = await Taro.showModal({
      // 'title': Taro.T._('Confirm'),
      'content': Taro.T._('Restore default timetable background?')
    })
    if (res.confirm) {
      Taro.setStorageSync("background_url", null);
      this.setState({ background_url: "" });
    }
  }
  render() {
  const styleStr = `height: ${this.state.tableHeight}px; ${this.state.background_url ? `background-image: url('${this.state.background_url}'); background-size: 100% 100%;` : ""}`;
    
    return (
      <View className="change-bg">
        {this.state.showCropper &&
        <TaroCropper
          fullScreen
          ref={this.catTaroCropper}
          src={this.state.src}
          onCut={this.uploadImg}
          onCancel={() => { this.setState({ showCropper: false })}}
          hideCancelText={false}
          cropperHeight={this.state.tableHeight * 1.25}
          cropperWidth={this.state.tableWidth * 1.25}
          themeColor="#ff9800"
        />}
        {!this.state.showCropper &&
        <View>
          <Navigation title={Taro.T._('Change Timetable Background')} />

          <View className={this.state.background_url ? "page-container" : "page-container page-container-default"} style={styleStr}>
            <View className="btn-group">

              <Button
                onClick={this.selectImg}
                className="btn-1 btn"
              >{Taro.T._('Change Timetable Background')}</Button>
              
              {this.state.background_url &&
              <Button
                onClick={this.restore}
                className="btn-2 btn">
                  {Taro.T._('Restore Default Timetable Background')}
              </Button>
              }
              
            </View>
          </View>

        </View>
        }
      </View>
    )
  }
}
