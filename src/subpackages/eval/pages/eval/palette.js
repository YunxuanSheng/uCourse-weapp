const bgImage =
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/share-back.jpg'

const cardWidth = 750
const cardHeight = 937.5

const rectMargin = 50
const rectPadding = 50
const rectWidth = cardWidth - rectMargin * 2
const rectHeight = cardHeight - rectMargin * 2

const qrWidth = 150
const qrHeight = qrWidth
const qrBottom = rectMargin + rectPadding
const qrLeft = qrBottom
const qrMarginRight = 50

const hintTextFontSize = 32
const hintTextLeft = qrLeft + qrWidth + qrMarginRight
const hintTextBottom = qrBottom + qrHeight / 2 - hintTextFontSize / 2

const hintBgBottom = hintTextBottom - hintTextFontSize * 0.4
const hintBgLeft = hintTextLeft
const hintBgHeight = hintTextFontSize * 1.5
const hintBgWidth = hintTextFontSize * 11 // word count

const avatarHeight = 64
const avatarWidth = avatarHeight
const avatarTop = rectMargin + rectPadding
const avatarLeft = avatarTop
const avatarMarginRight = 20

const nicknameFontSize = 36
const nicknameTop = avatarTop
const nicknameLeft = avatarLeft + avatarWidth + avatarMarginRight

const titleFontSize = 20
const titleTop = nicknameTop + nicknameFontSize * 1.25
const titleLeft = nicknameLeft
const titleWidth =
  cardWidth - (rectMargin + rectPadding) * 2 - avatarMarginRight

const contentFontSize = 32
const contentLineHeight = contentFontSize * 1.5
const contentWidth = cardWidth - (rectMargin + rectPadding) * 2
const contentTop = avatarTop + avatarHeight + avatarMarginRight
const contentLeft = avatarLeft

export default {
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
      type: 'rect',
      css: {
        top: rectMargin + 'px',
        right: rectMargin + 'px',
        left: rectMargin + 'px',
        bottom: rectMargin + 'px',
        color: '#fff',
        borderRadius: '20px',
        width: rectWidth + 'px',
        height: rectHeight + 'px',
      },
    },
    {
      type: 'image',
      url: '__QRCODE__',
      css: {
        bottom: qrBottom + 'px',
        left: qrLeft + 'px',
        width: qrWidth + 'px',
        height: qrHeight + 'px',
      },
    },
    {
      type: 'rect',
      css: {
        color: '#ff9800',
        bottom: hintBgBottom + 'px',
        left: hintBgLeft + 'px',
        height: hintBgHeight + 'px',
        width: hintBgWidth + 'px',
      },
    },
    {
      type: 'text',
      text: ' 扫码查看更多课程测评',
      css: [
        {
          color: '#eee',
          bottom: hintTextBottom + 'px',
          left: hintTextLeft + 'px',
          fontSize: hintTextFontSize + 'px',
          fontWeight: 'bold',
        },
      ],
    },
    {
      type: 'image',
      url: '__AVATAR__',
      css: {
        mode: 'aspectFit',
        top: avatarTop + 'px',
        left: avatarLeft + 'px',
        width: avatarWidth + 'px',
        height: avatarHeight + 'px',
        borderRadius: '100px',
      },
    },
    {
      type: 'text',
      text: '__NICKNAME__',
      css: [
        {
          top: nicknameTop + 'px',
          left: nicknameLeft + 'px',
          fontSize: nicknameFontSize + 'px',
          fontWeight: 'bold',
        },
      ],
    },
    {
      type: 'text',
      text: '__TITLE__',
      css: [
        {
          top: titleTop + 'px',
          left: titleLeft + 'px',
          width: titleWidth + 'px',
          maxLines: '1',
          fontSize: titleFontSize + 'px',
        },
      ],
    },
    {
      type: 'text',
      text: '__CONTENT__',
      css: [
        {
          top: contentTop + 'px',
          left: contentLeft + 'px',
          width: contentWidth + 'px',
          fontSize: contentFontSize + 'px',
          maxLines: '10',
          lineHeight: contentLineHeight + 'px',
        },
      ],
    },
  ],
}
