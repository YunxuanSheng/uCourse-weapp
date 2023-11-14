import Taro from '@tarojs/taro'

const majorData = [
  {
    school: 'ABE',
    schoolFull: 'Department of Architecture and Built Environment',
    majors: [
      {
        code: 'AEE',
        name: 'Architectural Environment Engineering',
        // icon: 'https://i.loli.net/2018/07/14/5b498b73dceb2.png', // 建筑课
        icon: 'https://i.loli.net/2018/07/14/5b49990f537d3.png',
      },
      {
        code: 'ARCH',
        name: 'Architecture',
        // icon: 'https://i.loli.net/2018/07/14/5b498b73dceb2.png', // 建筑课
        icon: 'https://i.loli.net/2018/07/14/5b49990f537d3.png',
      },
    ],
  },
  {
    school: 'CEE',
    schoolFull: 'Department of Chemical and Environmental Engineering',
    majors: [
      {
        code: 'CEE',
        name: 'Chemical Engineering',
        // icon: 'https://i.loli.net/2018/07/14/5b498bc927668.png', // 化学
        icon: 'https://i.loli.net/2018/07/14/5b4998f86dba4.png',
      },
      {
        code: 'CHEM',
        name: 'Chemistry',
        // icon: 'https://i.loli.net/2018/07/14/5b498f40cda0d.png', // 生物
        icon: 'https://i.loli.net/2018/07/14/5b499911ab6b9.png',
      },
    ],
  },
  {
    school: 'CIVE',
    schoolFull: 'Department of Civil Engineering',
    majors: [
      {
        code: 'CE',
        name: 'Civil Engineering',
        // icon: 'https://i.loli.net/2018/07/14/5b498b73dceb2.png', // 建筑课
        icon: 'https://i.loli.net/2018/07/14/5b49990f537d3.png',
      },
      { code: 'EE', name: 'Environmental Engineering' },
    ],
  },
  {
    school: 'EEE',
    schoolFull: 'Department of Electrical and Electronic Engineering',
    majors: [
      {
        code: 'EEE',
        name: 'Electrical and Electronic Engineering',
        // icon: 'https://i.loli.net/2018/07/14/5b498fab499f5.png', // 电子技术
        icon: 'https://i.loli.net/2018/07/14/5b4999048893c.png',
      },
      {
        code: 'MES',
        name: 'Mechatronic Engineering', // 小 ME
        // icon: 'https://i.loli.net/2018/07/14/5b498fab499f5.png', // 电子技术
        icon: 'https://i.loli.net/2018/07/14/5b4999048893c.png',
      },
    ],
  },
  {
    school: 'MMME',
    schoolFull: 'Department of Mechanical, Materials and Manufactur',
    majors: [
      {
        code: 'MEL',
        name: 'Mechanical Engineering', // 大 ME
        // icon: 'https://i.loli.net/2018/07/14/5b498c52e8418.png', // 工程绘图
        icon: 'https://i.loli.net/2018/07/14/5b4998e7d3935.png',
      },
      {
        code: 'PDM',
        name: 'Product Design and Manufacture',
        // icon: 'https://i.loli.net/2018/07/14/5b498d3e12908.png', // 平面
        icon: 'https://i.loli.net/2018/07/14/5b4998e2de94e.png',
      },
    ],
  },
  {
    school: 'SER',
    schoolFull: 'Division of Science and Engineering (Research)',
    majors: [],
  },
  {
    school: 'NUBS',
    schoolFull: 'Nottingham University Business School China',
    majors: [
      {
        code: 'FAM',
        name: 'Finance Accounting and Management',
        // icon: 'https://i.loli.net/2018/07/14/5b49922ba565a.png', // 创业
        icon: 'https://i.loli.net/2018/07/14/5b4998e539810.png',
      },
      {
        code: 'IEL',
        name: 'International Business with Language',
        // icon: 'https://i.loli.net/2018/07/14/5b498f132c946.png', // 英语
        icon: 'https://i.loli.net/2018/07/14/5b4998f71de58.png',
      },
      {
        code: 'IBE',
        name: 'International Business Economics',
        // icon: 'https://i.loli.net/2018/07/14/5b498cbb57390.png', // 经济
        icon: 'https://i.loli.net/2018/07/14/5b4998e2ebebe.png',
      },
      {
        code: 'IBM',
        name: 'International Business Management',
        // icon: 'https://i.loli.net/2018/07/14/5b498dcbb1506.png', // 管理
        icon: 'https://i.loli.net/2018/07/14/5b4999046d06f.png',
      },
      {
        code: 'IBCS',
        name: 'International Business with Communications Studies',
        // icon: 'https://i.loli.net/2018/07/14/5b499030aed53.png', // 社团
        icon: 'https://i.loli.net/2018/07/14/5b4998edd60dd.png',
      },
    ],
  },
  {
    school: 'AERO',
    schoolFull: 'School of Aerospace',
    majors: [
      {
        code: 'AERO',
        name: 'Aerospace Engineering',
        // icon: 'https://i.loli.net/2018/07/14/5b498f5bb112d.png', // 航空航天
        icon: 'https://i.loli.net/2018/07/14/5b4999112302e.png',
      },
    ],
  },
  {
    school: 'CS',
    schoolFull: 'School of Computer Science',
    majors: [
      {
        code: 'CS',
        name: 'Computer Science',
        // icon: 'https://i.loli.net/2018/07/14/5b498d54dd0be.png', // 计算机
        icon: 'https://i.loli.net/2018/07/14/5b499901c2106.png',
      },
      {
        code: 'CSAI',
        name: 'Computer Science with Artificial Intelligence',
        // icon: 'https://i.loli.net/2018/07/14/5b498f8534a6b.png', // 网络课
        icon: 'https://i.loli.net/2018/07/14/5b4999112191a.png',
      },
    ],
  },
  {
    school: 'CCS',
    schoolFull: 'School of Contemporary Chinese Studies',
    majors: [],
  },
  {
    school: 'ECON',
    schoolFull: 'School of Economics',
    majors: [
      {
        code: 'ECON',
        name: 'Economics',
        // icon: 'https://i.loli.net/2018/07/14/5b498cbb57390.png', // 经济
        icon: 'https://i.loli.net/2018/07/14/5b4998e2ebebe.png',
      },
      {
        code: 'IET',
        name: 'International Economics and Trade',
        // icon: 'https://i.loli.net/2018/07/14/5b498cbb57390.png', // 经济
        icon: 'https://i.loli.net/2018/07/14/5b4998e2ebebe.png',
      },
    ],
  },
  {
    school: 'EDU',
    schoolFull: 'School of Education',
    majors: [],
  },
  {
    school: 'EDEN',
    schoolFull: 'School of Education and English',
    majors: [],
  },
  {
    school: 'ENGL',
    schoolFull: 'School of English',
    majors: [
      {
        code: 'ELAL',
        name: 'English Language and Applied Linguistics',
        // icon: 'https://i.loli.net/2018/07/14/5b498d8597fc9.png', // 语文
        icon: 'https://i.loli.net/2018/07/14/5b4998ee85036.png',
      },
      {
        code: 'ELL',
        name: 'English Language and Literature',
        // icon: 'https://i.loli.net/2018/07/14/5b498e220dbc2.png', // 阅读
        icon: 'https://i.loli.net/2018/07/14/5b4998fb7cc2a.png',
      },
      {
        code: 'EIB',
        name: 'English with International Business',
        // icon: 'https://i.loli.net/2018/07/14/5b498e74cb180.png', // 书法
        icon: 'https://i.loli.net/2018/07/14/5b499900f214d.png',
      },
    ],
  },
  {
    school: 'GEOG',
    schoolFull: 'School of Geographical Sciences',
    majors: [{ code: 'ENVS', name: 'Environmental Sciences' }],
  },
  {
    school: 'IC',
    schoolFull: 'School of International Communications',
    majors: [
      {
        code: 'ICS',
        name: 'International Communications Studies',
        // icon: 'https://i.loli.net/2018/07/14/5b4990f746030.png', // 讨论
        icon: 'https://i.loli.net/2018/07/14/5b4998ee3228a.png',
      },
      {
        code: 'ICSC',
        name: 'International Communications Studies with Chinese',
        // icon: 'https://i.loli.net/2018/07/14/5b4990c68229c.png', // 普通话
        icon: 'https://i.loli.net/2018/07/14/5b4998e9b9051.png',
      },
    ],
  },
  {
    school: 'IS',
    schoolFull: 'School of International Studies',
    majors: [
      {
        code: 'IS',
        name: 'International Studies',
        // icon: 'https://i.loli.net/2018/07/14/5b498e610816a.png', // 班会
        icon: 'https://i.loli.net/2018/07/14/5b4998fcbd1a8.png',
      },
      {
        code: 'ISL',
        name: 'International Studies with Languages',
        // icon: 'https://i.loli.net/2018/07/14/5b498de379f10.png', // 小语种
        icon: 'https://i.loli.net/2018/07/14/5b49990400354.png',
      },
      {
        code: 'ES',
        name: 'European Studies',
        // icon: 'https://i.loli.net/2018/07/14/5b49907b2ca75.png', // 历史
        icon: 'https://i.loli.net/2018/07/14/5b4998fb1a4bd.png',
      },
    ],
  },
  {
    school: 'MATH',
    schoolFull: 'School of Mathematical Sciences',
    majors: [
      {
        code: 'MAM',
        name: 'Mathematics with Applied Mathematics',
        // icon: 'https://i.loli.net/2018/07/14/5b498c8727e18.png', // 数学
        icon: 'https://i.loli.net/2018/07/14/5b4998ed855b5.png',
      },
      {
        code: 'STAT',
        name: 'Statistics',
        // icon: 'https://i.loli.net/2018/07/14/5b4990008b141.png', // 统计
        icon: 'https://i.loli.net/2018/07/14/5b4998e3cb296.png',
      },
    ],
  },
]

const medalData = [
  {
    code: 'OLDEST',
    name: '赢在起跑线',
    description: '前 100 名注册用户',
    quote: '评测要从娃娃抓起',
  },
  {
    code: 'FULLINFO',
    name: '无懈可击',
    description: '完成所有个人资料',
    quote: '肥宅也有完满人生',
  },
  {
    code: 'EVAL10',
    name: '意见领袖',
    description: '累计发布 10 篇评测',
    quote: '说的比唱的要好听',
  },
  {
    code: 'PRO100',
    name: '一呼百应',
    description: '累计获得 100 个赞同',
    quote: '下一步是万人演唱会',
  },
  {
    code: 'CON100',
    name: '群起而攻',
    description: '累计获得 100 个反对',
    quote: '这叫不与世俗同流合污',
  },
  {
    code: 'CMMT10',
    name: '七嘴八舌',
    description: '累计发布 10 条评论',
    quote: '欢迎加入水军俱乐部',
  },
  {
    code: 'CMMT100',
    name: '啰里八嗦',
    description: '累计发布 100 条评论',
    quote: '但并不是杠精的存在',
  },
]

const shareImageUrls = [
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/share-banner-1.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/share-banner-2.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/share-banner-3.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/share-banner-4.jpg',
]

const years = [
  { year: '2022～2023', value: '2023' },
  { year: '2021～2022', value: '2022' },
  { year: '2020～2021', value: '2021' },
  { year: '2019～2020', value: '1920' },
  { year: '2018～2019', value: '1819' },
  { year: '2017～2018', value: '1718' },
  { year: '2016～2017', value: '1617' },
  { year: '2015～2016', value: '1516' },
  { year: '2014～2015', value: '1415' },
  { year: '2013～2014', value: '1314' },
  { year: '2012～2013', value: '1213' },
  // { year: '2011～2012', value: '1112' },
  { year: Taro.T._('Ancient Times'), value: '0' },
]

const levels = [
  Taro.T._('Y1'),
  Taro.T._('Y2'),
  Taro.T._('Y3'),
  Taro.T._('Y4'),
  Taro.T._('PG'),
]

const calendarBgUrls = [
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_01_january.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_02_february.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_03_march.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_04_april.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_05_may.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_06_june.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_07_july.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_08_august.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_09_september.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_10_october.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_11_november.jpg',
  'https://ufair.oss-cn-hangzhou.aliyuncs.com/img/bkg_12_december.jpg',
]

const flags = {
  Australia: '🇦🇺',
  Denmark: '🇩🇰',
  HK: '🇭🇰',
  Macau: '🇲🇴',
  Taiwan: '',
  Canada: '🇨🇦',
  Egypt: '🇪🇬',
  Ireland: '🇮🇪',
  Malaysia: '🇲🇾',
  'The Netherlands': '🇳🇱',
  Chile: '🇨🇱',
  Finland: '🇫🇮',
  Italy: '🇮🇹',
  'New Zeland': '🇳🇿',
  UK: '🇬🇧',
  China: '🇨🇳',
  France: '🇫🇷',
  Japan: '🇯🇵',
  Spain: '🇪🇸',
  USA: '🇺🇸',
  Colombia: '🇨🇴',
  Germany: '🇩🇪',
  Korea: '🇰🇷',
  Switzerland: '🇨🇭',
}

export {
  majorData,
  medalData,
  shareImageUrls,
  years,
  levels,
  calendarBgUrls,
  flags,
}
