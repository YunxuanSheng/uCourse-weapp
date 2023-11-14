// placeholders:
// __AVATAR__
// __NICKNAME__
// __BODYTEXT__
// __QRCODE__

const PIC_WIDTH = 700
const PIC_HEIGHT = 900
const PIC_PADDING = 25
const AVATAR_WIDTH = 90
const USERINFO_LEFT = PIC_PADDING * 2 + AVATAR_WIDTH
const USERINFO_FONT_SIZE = 32
const VOTE_PIC_TOP = PIC_PADDING + AVATAR_WIDTH + 50
const VOTE_PIC_HEIGHT = 222
const VOTE_PIC_WIDTH = 646
const BODY_TEXT_TOP = VOTE_PIC_TOP + VOTE_PIC_HEIGHT + 50
const BODY_TEXT_FONT_SIZE = 30
const BODY_TEXT_WIDTH = PIC_WIDTH - PIC_PADDING * 2
const BODY_TEXT_LINE_HEIGHT = BODY_TEXT_FONT_SIZE * 1.5
const QR_WIDTH = 150
const QR_BOTTOM = 50
const QR_LEFT = 100
const QR_HINT_LEFT = QR_LEFT + QR_WIDTH + 25
const QR_HINT_FONT_SIZE = 32
const QR_HINT_LINE_HEIGHT = QR_HINT_FONT_SIZE * 1.5
const QR_HINT_BOTTOM = QR_BOTTOM
const QR_HINT_BOTTOM2 = QR_HINT_BOTTOM + QR_HINT_LINE_HEIGHT
const LINE_BOTTOM = QR_BOTTOM + QR_WIDTH + PIC_PADDING - 20

export default {
  background: '#fff',
  width: PIC_WIDTH + 'px',
  height: PIC_HEIGHT + 'px',
  views: [
    {
      type: 'image',
      url: '__AVATAR__',
      css: {
        mode: 'aspectFit',
        top: PIC_PADDING + 'px',
        left: PIC_PADDING + 'px',
        width: AVATAR_WIDTH + 'px',
        height: AVATAR_WIDTH + 'px',
        borderRadius: '100px',
      },
    },
    {
      type: 'text',
      text: '__NICKNAME__',
      css: [
        {
          top: PIC_PADDING + 'px',
          left: USERINFO_LEFT + 'px',
          fontSize: USERINFO_FONT_SIZE + 'px',
          fontWeight: 'bold',
        },
      ],
    },
    {
      type: 'text',
      text: '邀你参与话题讨论',
      css: [
        {
          top: PIC_PADDING + USERINFO_FONT_SIZE * 1.5 + 'px',
          left: USERINFO_LEFT + 'px',
          fontSize: USERINFO_FONT_SIZE + 'px',
          color: '#9b9b9b',
        },
      ],
    },
    {
      type: 'image',
      url: 'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/vote-banner.jpg',
      css: {
        mode: 'aspectFit',
        top: VOTE_PIC_TOP + 'px',
        left: PIC_PADDING + 'px',
        width: VOTE_PIC_WIDTH + 'px',
        height: VOTE_PIC_HEIGHT + 'px',
      },
    },
    {
      type: 'text',
      text:
        // '我刚刚在话题「__TOPIC__」中投票给「__COURSE__」。__RANDOMTEXT__',
        '__BODYTEXT__',
      css: [
        {
          top: BODY_TEXT_TOP + 'px',
          left: PIC_PADDING + 'px',
          width: BODY_TEXT_WIDTH + 'px',
          fontSize: BODY_TEXT_FONT_SIZE + 'px',
          lineHeight: BODY_TEXT_LINE_HEIGHT + 'px',
          maxLines: '5',
        },
      ],
    },
    {
      type: 'image',
      url: '__QRCODE__',
      css: {
        bottom: PIC_PADDING + 'px',
        left: QR_LEFT + 'px',
        width: QR_WIDTH + 'px',
        height: QR_WIDTH + 'px',
      },
    },
    {
      type: 'text',
      text: '长按二维码查看详情',
      css: [
        {
          bottom: QR_HINT_BOTTOM2 + 'px',
          left: QR_HINT_LEFT + 'px',
          fontSize: QR_HINT_FONT_SIZE + 'px',
          lineHeight: QR_HINT_LINE_HEIGHT + 'px',
          color: '#9b9b9b',
        },
      ],
    },
    {
      type: 'text',
      text: '分享自「uCourse」',
      css: [
        {
          bottom: QR_HINT_BOTTOM + 'px',
          left: QR_HINT_LEFT + 'px',
          fontSize: QR_HINT_FONT_SIZE + 'px',
          lineHeight: QR_HINT_LINE_HEIGHT + 'px',
          color: '#9b9b9b',
        },
      ],
    },
    {
      type: 'image',
      url: 'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/black-bottom-line.jpg',
      css: {
        mode: 'aspectFit',
        bottom: LINE_BOTTOM + 'px',
        left: '0px',
        width: PIC_WIDTH + 'px',
        height: 5 + 'px',
      },
    },
  ],
}
