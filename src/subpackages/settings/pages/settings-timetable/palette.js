const bgImage = 'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/stat-share-background-clean.jpg'

const cardWidth = 750
const cardHeight = 1187.5

const palette =  {
  background: '#eee',
  width: cardWidth + 'px',
  height: cardHeight + 'px',
  // borderRadius: '20rpx',
  views: [
    {
      type: 'image',
      url: bgImage,
      css: {
        width: cardWidth + 'px',
        height: cardHeight + 'px',
        mode: 'aspectFit',
      },
    },
    {
      type: 'image',
      url: '__SELFAVATAR__',
      css: {
        top: '200px',
        left: '100px',
        height: '170px',
        width: '170px',
        mode: 'aspectFit',
        borderRadius: '200px',
      },
    },
    {
      type: 'text',
      text: '__SELFNICKNAME__',
      css: {
        top: '125px',
        left: '290px',
        fontSize: '30px',
        fontWeight: 'bold',
      },
    },
    {
      type: 'text',
      // text: '本学期一共 12 节课',
      text: '本学期一共 __NUMOFCOURSES__ 节课',
      css: {
        top: '170px',
        left: '290px',
        fontSize: '27px',
        lineHeight: '45px',
        width: '400px',
      },
    },
    {
      type: 'text',
      // text: '总时长 254 小时',
      text: '总时长 __NUMOFHOURS__ 小时',
      css: {
        top: '215px',
        left: '290px',
        fontSize: '27px',
        lineHeight: '45px',
        width: '400px',
      },
    },
    {
      type: 'text',
      // text: '超过了 76% 的 UNNCer',
      text: '超过了 __RANKING__ 的 UNNCer',
      css: {
        top: '260px',
        left: '290px',
        fontSize: '27px',
        lineHeight: '45px',
        width: '400px',
      },
    },
    {
      type: 'image',
      url: '__QRCODE__',
      css: {
        bottom: '80px',
        right: '100px',
        width: '160px',
        height: '160px',
      },
    },
    {
      type: 'text',
      // text: '新学期的 flag 还是要继续立的，万一实现了呢？',
      text: '__FOOTNOTE__',
      css: {
        top: '950px',
        left: '160px',
        width: '250px',
        fontSize: '25px',
        lineHeight: '40px',
      },
    },
    {
      type: 'rect',
      css: {
        color: '#ff9800',
        bottom: '65px',
        left: '130px',
        height: '50px',
        width: '350px',
      },
    },
    {
      type: 'text',
      text: '扫码领取 UNNC 课表',
      css: {
        color: '#fff',
        bottom: '68px',
        left: '140px',
        fontSize: '22px',
        lineHeight: '37px',
        fontWeight: 'bold',
      },
    },
    {
      type: 'text',
      // text: '一周多达 3 节早课，早起的鸟儿学习好。',
      text: '__MORNING__',
      css: {
        top: '440px',
        left: '180px',
        fontSize: '31px',
        lineHeight: '45px',
        width: '390px',
      },
    },
    {
      type: 'text',
      // text: '一周平均有 9 节课，学费没有白交。',
      text: '__PERWEEK__',
      css: {
        top: '590px',
        left: '180px',
        fontSize: '31px',
        lineHeight: '45px',
        width: '390px',
      },
    },
    {
      type: 'text',
      // text: '2019年4月23日是最忙碌的一天，当天共有 4 节课，8 小时投入学习！',
      text: '__BUSIEST__',
      css: {
        top: '740px',
        left: '180px',
        fontSize: '31px',
        lineHeight: '45px',
        width: '390px',
      },
    },
  ],
}

const examPalette = {
  background: '#eee',
  width: cardWidth + 'px',
  height: cardHeight + 'px',
  // borderRadius: '20rpx',
  views: [
    // background img
    {
      type: 'image',
      url: bgImage,
      css: {
        width: cardWidth + 'px',
        height: cardHeight + 'px',
        mode: 'aspectFit',
      },
    },

    // user avatar
    {
      type: 'image',
      url: '__SELFAVATAR__',
      css: {
        top: '200px',
        left: '100px',
        height: '170px',
        width: '170px',
        mode: 'aspectFit',
        borderRadius: '200px',
      },
    },

    // user nickname
    {
      type: 'text',
      text: '__SELFNICKNAME__',
      css: {
        top: '125px',
        left: '290px',
        fontSize: '30px',
        fontWeight: 'bold',
      },
    },

    // exam count
    {
      type: 'text',
      // text: '本学期一共 12 节课',
      text: '本学期期末共 __NUMOFEXAMS__ 场考试',
      css: {
        top: '170px',
        left: '290px',
        fontSize: '30px',
        lineHeight: '45px',
        width: '400px',
      },
    },

    // hour count
    {
      type: 'text',
      // text: '总时长 254 小时',
      text: '线下考试总时长 __NUMOFHOURS__ 小时',
      css: {
        top: '215px',
        left: '290px',
        fontSize: '30px',
        lineHeight: '45px',
        width: '400px',
      },
    },

    // online test count
    {
      type: 'text',
      text: '线上考试共 __ONLINENUMBER__ 场',
      css: {
        top: '260px',
        left: '290px',
        fontSize: '30px',
        lineHeight: '45px',
        width: '400px',
      },
    },

    // qr code
    {
      type: 'image',
      url: '__QRCODE__',
      css: {
        bottom: '80px',
        right: '100px',
        width: '160px',
        height: '160px',
      },
    },

    // footnote
    {
      type: 'text',
      // text: '新学期的 flag 还是要继续立的，万一实现了呢？',
      text: '__FOOTNOTE__',
      css: {
        top: '950px',
        left: '160px',
        width: '250px',
        fontSize: '25px',
        lineHeight: '40px',
      },
    },

    // rect
    {
      type: 'rect',
      css: {
        color: '#ff9800',
        bottom: '65px',
        left: '150px',
        height: '50px',
        width: '270px',
      },
    },

    // text
    {
      type: 'text',
      text: '扫码领取考试海报日程',
      css: {
        color: '#fff',
        bottom: '70px',
        left: '160px',
        fontSize: '25px',
        lineHeight: '37px',
        fontWeight: 'bold',
      },
    },

    // first sentence
    {
      type: 'text',
      // text: '一周多达 3 节早课，早起的鸟儿学习好。',
      text: '__FIRST__',
      css: {
        top: '440px',
        left: '175px',
        fontSize: '29px',
        lineHeight: '45px',
        width: '400px',
      },
    },

    // second sentence
    {
      type: 'text',
      // text: '一周平均有 9 节课，学费没有白交。',
      text: '__SECOND__',
      css: {
        top: '590px',
        left: '175px',
        fontSize: '29px',
        lineHeight: '45px',
        width: '400px',
      },
    },

    // third sentence
    {
      type: 'text',
      // text: '2019年4月23日是最忙碌的一天，当天共有 4 节课，8 小时投入学习！',
      text: '__THIRD__',
      css: {
        top: '740px',
        left: '175px',
        fontSize: '29px',
        lineHeight: '45px',
        width: '400px',
      },
    },
  ],
}

export { examPalette, palette };