const getRandomElement = arr => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const getStats = activities => {
  const mockData = {
    '0': 51,
    '20': 1,
    '21': 1,
    '36': 3,
    '37': 1,
    '43': 1,
    '46': 1,
    '53': 3,
    '54': 1,
    '60': 2,
    '62': 3,
    '66': 1,
    '68': 1,
    '71': 3,
    '72': 1,
    '73': 2,
    '75': 1,
    '79': 1,
    '90': 8,
    '101': 2,
    '105': 1,
    '106': 1,
    '108': 4,
    '109': 1,
    '114': 1,
    '116': 1,
    '118': 3,
    '119': 1,
    '121': 3,
    '122': 5,
    '123': 12,
    '124': 5,
    '125': 5,
    '126': 1,
    '128': 6,
    '129': 3,
    '131': 3,
    '133': 4,
    '134': 2,
    '135': 1,
    '136': 6,
    '137': 3,
    '138': 7,
    '139': 3,
    '140': 1,
    '141': 3,
    '142': 1,
    '143': 5,
    '144': 9,
    '145': 5,
    '146': 1,
    '147': 14,
    '148': 9,
    '150': 1,
    '156': 1,
    '158': 2,
    '161': 3,
    '163': 1,
    '164': 1,
    '166': 1,
    '167': 2,
    '168': 2,
    '169': 6,
    '172': 3,
    '175': 2,
    '176': 1,
    '177': 3,
    '178': 10,
    '179': 10,
    '180': 14,
    '181': 3,
    '183': 3,
    '185': 1,
    '186': 1,
    '190': 4,
    '192': 1,
    '193': 1,
    '194': 1,
    '197': 2,
    '198': 2,
    '199': 2,
    '201': 6,
    '202': 9,
    '203': 1,
    '204': 1,
    '205': 5,
    '206': 2,
    '207': 3,
    '208': 2,
    '209': 2,
    '211': 2,
    '212': 4,
    '213': 3,
    '214': 3,
    '218': 7,
    '219': 1,
    '220': 2,
    '221': 3,
    '222': 3,
    '223': 4,
    '224': 1,
    '225': 5,
    '226': 4,
    '227': 24,
    '228': 7,
    '229': 4,
    '230': 1,
    '231': 1,
    '232': 5,
    '233': 1,
    '234': 6,
    '235': 3,
    '236': 2,
    '237': 12,
    '238': 4,
    '239': 1,
    '240': 4,
    '241': 2,
    '242': 4,
    '243': 10,
    '244': 2,
    '245': 13,
    '246': 8,
    '247': 21,
    '248': 31,
    '249': 16,
    '250': 7,
    '251': 7,
    '252': 4,
    '253': 2,
    '254': 13,
    '255': 9,
    '256': 4,
    '257': 5,
    '258': 10,
    '259': 7,
    '260': 3,
    '261': 4,
    '262': 2,
    '263': 22,
    '264': 6,
    '265': 6,
    '266': 8,
    '268': 1,
    '269': 5,
    '270': 6,
    '271': 2,
    '272': 12,
    '273': 3,
    '274': 13,
    '275': 58,
    '276': 2,
    '277': 2,
    '279': 2,
    '280': 1,
    '281': 4,
    '282': 1,
    '283': 3,
    '284': 1,
    '285': 3,
    '286': 1,
    '288': 1,
    '290': 2,
    '294': 1,
    '295': 2,
    '296': 2,
    '297': 4,
    '298': 1,
    '299': 1,
    '300': 3,
    '301': 2,
    '302': 3,
    '303': 2,
    '306': 1,
    '307': 1,
    '308': 9,
    '309': 5,
    '310': 3,
    '315': 1,
    '316': 1,
    '319': 2,
    '320': 1,
    '325': 3,
    '330': 3,
    '336': 2,
    '349': 1,
    '354': 1,
    '375': 1,
    '378': 11,
    '382': 1,
    '383': 3,
    '390': 22,
    '402': 16,
    '403': 1,
    '405': 1,
    '407': 5,
    '413': 1,
    '414': 19,
    '439': 2,
    '444': 2,
    '447': 6,
    '454': 45,
    '462': 1,
    '500': 1,
    '515': 3,
    '539': 1,
    '543': 4,
    '547': 18,
    '591': 3,
    '594': 29,
    '596': 2,
    '607': 1,
    '640': 1,
    '648': 12,
    '697': 1,
    '712': 27,
    '246.5': 21,
    '205.5': 3,
    '208.5': 4,
    '168.5': 3,
    '229.5': 4,
    '225.5': 7,
    '263.5': 40,
    '254.5': 5,
    '252.5': 10,
    '245.5': 16,
    '270.5': 1,
    '247.5': 16,
    '237.5': 10,
    '258.5': 15,
    '239.5': 3,
    '223.5': 3,
    '273.5': 12,
    '226.5': 5,
    '249.5': 5,
    '59.5': 1,
    '207.5': 2,
    '244.5': 8,
    '282.5': 27,
    '199.5': 2,
    '250.5': 6,
    '240.5': 2,
    '234.5': 3,
    '260.5': 5,
    '224.5': 4,
    '145.5': 1,
    '255.5': 44,
    '221.5': 2,
    '264.5': 5,
    '231.5': 1,
    '242.5': 4,
    '299.5': 2,
    '301.5': 1,
    '143.5': 1,
    '220.5': 5,
    '165.5': 1,
    '259.5': 6,
    '126.5': 1,
    '287.5': 1,
    '152.5': 1,
    '248.5': 10,
    '174.5': 2,
    '236.5': 1,
    '235.5': 2,
    '256.5': 3,
    '164.5': 1,
    '204.5': 2,
    '281.5': 3,
    '251.5': 8,
    '169.5': 1,
    '140.5': 4,
    '243.5': 5,
    '257.5': 9,
    '267.5': 8,
    '271.5': 4,
    '216.5': 2,
    '191.5': 1,
    '238.5': 3,
    '253.5': 2,
    '272.5': 8,
    '200.5': 3,
    '68.5': 1,
    '129.5': 19,
    '206.5': 1,
    '269.5': 2,
    '211.5': 1,
    '228.5': 2,
    '300.5': 2,
    '77.5': 7,
    '134.5': 4,
    '227.5': 2,
    '279.5': 3,
    '280.5': 1,
    '230.5': 2,
    '158.5': 2,
    '166.5': 1,
    '671.5': 16,
    '98.5': 1,
    '213.5': 1,
    '137.5': 9,
    '106.5': 2,
    '218.5': 3,
    '304.5': 1,
    '275.5': 2,
    '572.5': 27,
    '138.5': 5,
    '19.5': 2,
    '139.5': 28,
    '283.5': 13,
    '288.5': 1,
    '144.5': 2,
    '232.5': 1,
    '262.5': 19,
    '116.5': 2,
    '261.5': 1,
    '148.5': 4,
    '198.5': 1,
    '298.5': 4,
    '128.5': 23,
    '93.5': 1,
    '142.5': 3,
    '141.5': 9,
    '241.5': 1,
    '155.5': 1,
    '136.5': 4,
    '117.5': 3,
    '149.5': 2,
    '305.5': 2,
    '217.5': 3,
    '45.5': 1,
    '292.5': 1,
    '347.5': 1,
    '210.5': 1,
    '297.5': 2,
    '276.5': 2,
    '302.5': 1,
    '291.5': 1,
    '294.5': 1,
    '274.5': 2,
    '163.5': 1,
    '278.5': 1,
    '100.5': 2,
    '92.5': 1,
    '123.5': 1,
    '197.5': 9,
    '187.5': 1,
    '265.5': 2,
    '311.5': 1,
    '131.5': 1,
    '344.5': 18,
    '566.5': 3,
    '147.5': 1,
    '192.5': 8,
    '373.5': 1,
    '309.5': 1,
    '188.5': 1,
    '181.5': 1,
    '293.5': 1,
    '114.5': 1,
    '18.5': 1,
  }

  const getNumOfCourses = activities => {
    return activities.map(a => a.weeks.length).reduce((a, b) => a + b, 0)
  }

  const getNumOfHours = activities => {
    return activities
      .map(a => {
        const duration =
          parseInt(a.duration.split(':')[0], 10) +
          parseInt(a.duration.split(':')[1], 10) / 60
        return duration * a.weeks.length
      })
      .reduce((a, b) => a + b, 0)
  }

  const getRanking = (numOfHours, hoursRank) => {
    const total = Object.values(hoursRank).reduce((a, b) => a + b, 0)
    const lower = Object.keys(hoursRank)
      .filter(hour => parseInt(hour, 10) / 2 < numOfHours)
      .map(hour => hoursRank[hour])
      .reduce((a, b) => a + b, 0)
    const percentage = parseFloat(((lower / total) * 100).toFixed(2))
    const fakePercentage = parseFloat((percentage - 3.8).toFixed(2)) // just leave rooms
    const fakeRanking = fakePercentage < 0 ? percentage : fakePercentage
    return fakeRanking
  }

  const getNumOfMornings = activities => {
    // weekly
    return activities.filter(a => a.start === '9:00').length
  }

  const getNumPerWeek = numOfCourses => {
    const startWeek = 23
    const endWeek = 34
    return parseFloat((numOfCourses / (endWeek - startWeek + 1)).toFixed(1))
  }

  const getBusiest = activities => {
    const counter = {}
    activities.forEach(a => {
      const duration =
        parseInt(a.duration.split(':')[0], 10) +
        parseInt(a.duration.split(':')[1], 10) / 60
      a.weeks.forEach(week => {
        const key = week + '/' + a.day
        if (counter[key] === undefined) {
          counter[key] = {
            counter: 1,
            duration,
            day: a.day,
          }
        } else {
          counter[key].counter += 1
          counter[key].duration += duration
        }
      })
    })
    let max = 0
    let busiest = {}
    Object.keys(counter).forEach(key => {
      if (counter[key].duration > max) {
        max = counter[key].duration
        busiest = counter[key]
      }
    })
    return busiest
  }

  const getMorningWording = numOfMornings => {
    const templates = {
      0: [
        '竟然一节早课都没有，用什么姿势赖床会比较合理。',
        '竟然一节早课都没有，我要起飞了。',
        '竟然一节早课都没有，专业选得好，早上睡得饱。',
      ],
      1: [
        '每周只有 1 节早课，美滋滋。',
        '每周只有 1 节早课，我要起飞了。',
        '每周只有 1 节早课，心里竟有点空落落的。',
      ],
      2: [
        '每周有 2 节早课，我的每周幸福度可能是 5/7。',
        '每周有 2 节早课，✌️。',
        '每周有 2 节早课，这就是早课两开花嘛？',
      ],
      3: [
        '每周有 3 节早课，我的每周幸福度可能是 4/7。',
        '每周有 3 节早课，👌👌👌。',
        '每周有 3 节早课，我要好好好学习，天天天向上。',
      ],
      4: [
        '每周有 4 节早课，哼，我不光早起，我还要晨跑。',
        '每周有 4 节早课，祝您四季发财。',
        '每周有 4 节早课，再来一节我就功成身就了。',
      ],
      5: [
        '每周有 5 节早课，啊，我圆满了。',
        '每周有 5 节早课，555。',
        '每周有 5 节早课，好快乐哦。',
      ],
    }
    const defaultTemplate = `所有早课高达 ${numOfMornings} 节，年度最佳勤学奖花落我家。`
    return templates[numOfMornings]
      ? getRandomElement(templates[numOfMornings])
      : defaultTemplate
  }

  const getPerWeekWording = numPerWeek => {
    const about = parseInt(numPerWeek, 10)
    const templates = {
      0: ['是不是弄错了？'],
      1: [`每周平均 ${numPerWeek} 节课，嘻嘻嘻嘻嘻嘻嘻。`],
      2: [`每周平均 ${numPerWeek} 节课，嘻嘻嘻嘻嘻嘻嘻。`],
      3: [
        `每周平均 ${numPerWeek} 节课，嘻嘻嘻嘻嘻嘻嘻。`,
        `每周平均 ${numPerWeek} 节课，无比悠闲。`,
      ],
      4: [
        `每周平均 ${numPerWeek} 节课，无比悠闲。`,
        `每周平均 ${numPerWeek} 节课，全得靠自己。`,
      ],
      5: [
        `每周平均 ${numPerWeek} 节课，5比悠闲。`,
        `每周平均 ${numPerWeek} 节课，全得靠自己。`,
        `每周平均 ${numPerWeek} 节课，我的学费都去哪了。`,
        `每周平均 ${numPerWeek} 节课，每节课性价比极高。`,
      ],
      6: [
        `每周平均 ${numPerWeek} 节课，说到六，我就想起……`,
        `每周平均 ${numPerWeek} 节课，全得靠自己。`,
        `每周平均 ${numPerWeek} 节课，我的学费都去哪了。`,
        `每周平均 ${numPerWeek} 节课，每节课学费单价极高。`,
        `每周平均 ${numPerWeek} 节课，还行还行。`,
      ],
      7: [
        `每周平均 ${numPerWeek} 节课，充实的学期啊。`,
        `每周平均 ${numPerWeek} 节课，一定要劳逸结合。`,
        `每周平均 ${numPerWeek} 节课，每节课学费单价相当高。`,
        `每周平均 ${numPerWeek} 节课，我能扛住。`,
        `每周平均 ${numPerWeek} 节课，学费没白交。`,
      ],
      8: [
        `每周平均 ${numPerWeek} 节课，充实的学期啊。`,
        `每周平均 ${numPerWeek} 节课，一定要劳逸结合。`,
        `每周平均 ${numPerWeek} 节课，不慌，能扛住。`,
        `每周平均 ${numPerWeek} 节课，学费没白交。`,
      ],
      9: [
        `每周平均 ${numPerWeek} 节课，充实的学期啊。`,
        `每周平均 ${numPerWeek} 节课，不慌，能扛住。`,
        `每周平均 ${numPerWeek} 节课，我选择了一门好专业。`,
        `每周平均 ${numPerWeek} 节课，学费没白交。`,
      ],
    }
    const defaultTemplate = `每周平均 ${numPerWeek} 节课，我一定是修了双学位。`
    return templates[about] ? getRandomElement(templates[about]) : defaultTemplate
  }

  const getBusiestWording = busiest => {
    const map = {
      Monday: '周一',
      Tuesday: '周二',
      Wednesday: '周三',
      Thursday: '周四',
      Friday: '周五',
      Saturday: '周六',
      Sunday: '周日',
    }
    const weekday = map[busiest.day]
    const wording = `${weekday}是最忙碌的一天，当天共有 ${
      busiest.counter
    } 节课，投入学习 ${busiest.duration} 小时。`
    return wording
  }

  const getFootnote = () => {
    const candidates = [
      '新学期的 flag 还是要继续立的，万一实现了呢？',
      '新的一年，新的学期，新的课表，这就是新的呼唤啊！',
      '望着这个课表，我是眼泪在肚子里，我笑不出来。',
      '书山有路勤为井，淆海无涯苦揍舟。',
      '翘课，是一个人的狂欢，上课，是一群人的孤单。',
    ]
    return getRandomElement(candidates)
  }

  activities = activities.filter(a => a.weeks.some(week => week /*>= 23*/))
  const numOfCourses = getNumOfCourses(activities)
  const numOfHours = getNumOfHours(activities)
  const ranking = getRanking(numOfHours, mockData)
  const numOfMornings = getNumOfMornings(activities)
  const numPerWeek = getNumPerWeek(numOfCourses)
  const busiest = getBusiest(activities)

  return {
    numOfCourses,
    numOfHours,
    ranking,
    numOfMornings,
    numPerWeek,
    busiest,
    morningsWording: getMorningWording(numOfMornings),
    perWeekWording: getPerWeekWording(numPerWeek),
    busiestWording: getBusiestWording(busiest),
    footnote: getFootnote(),
  }
}

const getExamStats = (exams) => {
  console.log('99', exams)
  const numberOfExamsDistr = {0: 2, 1: 1137, 2: 1680, 3: 1357, 4: 3153, 5: 580, 6: 5};
  // 0: 948, // those who don't have offline exams
  const goHomeDateDistr = {'2022-01-07': 710, '2022-01-05': 466, '2022-01-04': 699, '2022-01-06': 670, '2021-12-28': 350, '2022-01-10': 432, '2021-12-31': 2188, '2021-12-27': 66, '0': 263, '2022-01-11': 403, '2022-01-12': 109, '2021-12-29': 404, '2021-12-30': 737, '2022-01-08': 412, '2022-01-03': 5};
  // 0: 19, // those who don't have a single exam
  const dateSpanDistr = {11: 531, 1: 1152, 6: 53, 9: 644, 14: 81, 4: 837, 7: 196, 15: 308, 16: 255, 13: 220, 8: 355, 10: 184, 5: 1930, 3: 546, 0: 2, 21: 23, 12: 473, 2: 63, 17: 61};

  const getNumOfExams = (exams) => {
    return exams.length;
  };

  const isOfflineExam = (exam) => {
    return exam.room !== "Take Home Exam" && exam.room !== "Online Exam";
  };

  const getNumOfHours = (exams) => {
    return exams
      .map((a) => (isOfflineExam(a) ? a.duration : 0))
      .reduce((a, b) => a + b, 0) / 60;
  };

  const getNumOfOnlineExams = (exams) => {
    return exams
      .map((a) => (!isOfflineExam(a) ? 1 : 0))
      .reduce((a, b) => a + b);
  }

  const getGoHomeDate = (exams) => {
    return exams
      .map((a) => (isOfflineExam(a) ? a.datetime.slice(0, 10) : "0"))
      .reduce((a, b) => (a > b ? a : b), "0");
  };

  const getDateSpan = (exams) => {
    const dates = exams.map((a) => new Date(a.datetime.slice(0, 10)));
    const maxDate = dates.reduce(
      (a, b) => (a > b ? a : b),
      new Date("2021-12-20")
    );
    const minDate = dates.reduce(
      (a, b) => (a > b ? b : a),
      new Date("2022-01-17")
    );
    return (maxDate - minDate) / 24 / 3600000 + 1;
  };

  const getRanking = (sample, distribution, cmp) => {
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    const lower = Object.keys(distribution)
      .filter((a) => cmp(a, sample))
      .map((a) => distribution[a])
      .reduce((a, b) => a + b, 0);
    const percentage = parseFloat(((lower / total) * 100).toFixed(2)) + "%";
    return percentage;
  };

  const getLargerRankingRes = (sample, distribution, cmp1, adj1, cmp2, adj2) => {
    const ranking1 = getRanking(sample, distribution, cmp1);
    const ranking2 = getRanking(sample, distribution, cmp2);
    return ranking1 > ranking2 ? { ranking: ranking1, adj: adj1 } : { ranking: ranking2, adj: adj2 };
  }

  const getNumWording = (numOfExams, rankingRes) => {
    const { ranking, adj } = rankingRes;
    const numWording = [
      `竟然一场考试也没有，`,
      `期末只有 1 场考试，`,
      `期末有 ${numOfExams} 场考试，`,
    ][numOfExams <= 1 ? numOfExams : 2];
    const rankingWording = `${adj}于 ${ranking} 的 UNNCer，`;
    const explanation = getRandomElement(
      {
        0: [
          `无事一身轻，有事就无情。`,
          `奇了怪了，你们都要复习的吗？`,
          `拜拜了您嘞👋`,
        ],
        1: [`一举定乾坤。`, `感谢为我平凡的生活增添了一门考试。`, `就一门！冲就完事！👊`, `一门，全力以赴，问题不大！`],
        2: [`喝完这一杯，还有一杯～`, `考试进程0/2`, `这就是两开花吗？`],
        3: [
          `举杯邀明月，对影成三人。`,
          `可以说是宁诺平均考试门数了。`,
          `不多不少，3门刚刚好👍`,
        ],
        4: [
          `复习季发量开始紧张。`,
          `再喝完这一杯，还有三杯~`,
          `多啦A梦的记忆面包可以给我一片么？`,
        ],
        5: [`五岭逶迤腾细浪，乌蒙磅礴走泥丸。`, `你们的快乐与我无关。`, `放宽心，还有人要考6门☺️`],
        6: [
          `谁知道我们，该去向何处？谁明白考试，已变为何物？`,
          `学海无涯苦作舟，但这也太苦了点吧。`,
          `真的有人要考这么多门吗？🧐 `,
        ],
        7: [`这么多考试我都快应付不过来了。`],
      }[numOfExams <= 6 ? numOfExams : 7]
    );
    return numWording + rankingWording + explanation;
  };

  const getHomeDateWording = (homeDate, rankingRes) => {
    const { ranking, adj } = rankingRes;
    const numWording = [`不用在学校考试，`, `${homeDate} 结束在校考试，`][
      homeDate === "0" ? 0 : 1
    ];
    const rankingWording = [`回家${adj}于 ${ranking} 的 UNNCer，`, `${adj}于 ${ranking} 的 UNNCer，`][
      homeDate === "0" ? 0 : 1
    ];
    const template = {
      0: [
        "可以买最早的车票回家了。",
        "全校的考场都不属于我。",
        "回家冲冲冲！",
      ],
      1: [
        "回家跨年咯🥳！",
        "好好思考一下去哪里跨年？",
        "今年学的全丢在2021咯！",
      ],
      2: [
        "跨完年还得回来考试qwq",
        "哦嚯，回家跨年的愿望又落空了。",
        "今年的跨年活动是复习吗🤔 ",
      ],
      3: [
        "二零二二第一周，学不成名誓不休。",
        "真不戳，图书馆不用早起抢座了。",
        "没事，还有人比我更晚回家🥲",
      ],
      4: [
        "年度守门员认证。",
        "守门员竟是我自己。",
        "是守门员没错了😥",
      ],
    };
    const explanation = getRandomElement(
      {
        "0": template["0"],
        "2021-12-27": template["1"],
        "2021-12-28": template["1"],
        "2021-12-29": template["1"],
        "2021-12-30": template["1"],
        "2021-12-31": template["1"],
        "2022-01-01": template["2"],
        "2022-01-02": template["2"],
        "2022-01-03": template["2"],
        "2022-01-04": template["2"],
        "2022-01-05": template["3"],
        "2022-01-06": template["3"],
        "2022-01-07": template["3"],
        "2022-01-08": template["3"],
        "2022-01-09": template["4"],
        "2022-01-10": template["4"],
        "2022-01-11": template["4"],
        "2022-01-12": template["4"],
      }[homeDate]
    );
    return numWording + rankingWording + explanation;
  };

  
  const getDateSpanWording = (dateSpan, rankingRes) => {
    const { ranking, adj } = rankingRes;
    const numWording = `我的期末考试持续了 ${dateSpan} 天，`;
    const rankingWording = `${adj}于 ${ranking} 的 UNNCer，`;
    const template = {
      0: [
        "我已经退出群聊。"
      ],
      1: [
        "速战速决！",
        "天下武功，唯快不破。",
        "reading要背不完啦",
      ],
      2: [
        "一周回到解放前。",
        "人生很短，考试周很长。",
      ],
      3: [
        "一二三四五，等得好辛苦。",
        "时间管理达人🈶️",
      ],
      4: [
        "长夜漫漫难入眠, 只缘心中念红颜。",
        "复习季，考试月💪",
        "愿称为马拉松运动员💪"
      ],
    };
    const explanation = getRandomElement(
      {
        "0": template["0"],
        "1": template["1"],
        "2": template["1"],
        "3": template["2"],
        "4": template["2"],
        "5": template["2"],
        "6": template["3"],
        "7": template["3"],
        "8": template["3"],
        "9": template["3"],
        "10": template["3"],
        "11": template["3"],
        "12": template["4"],
        "13": template["4"],
        "14": template["4"],
        "15": template["4"],
        "16": template["4"],
        "17": template["4"],

      }[dateSpan]
    );
    return numWording + rankingWording + explanation;
  };



  const getFootnote = () => {
    const candidates = [
      "烟花声，空调声，读书声，声声入耳。",
      "留得头发在，不怕没题做。",
      "离自由一步之遥！",
      "和考试谈一场不分手的恋爱。",
      "没有困难的考试，只有勇敢的考试狗。",
    ];
    return getRandomElement(candidates);
  };

  
  
// need to get: number of exams, total length, number of online exams,
// number of exams and its ranking; go home date and its ranking; date span and its ranking
// input: exam list

  const numOfExams = getNumOfExams(exams);
  const rankingResNumOfExams = getLargerRankingRes(
    numOfExams, 
    numberOfExamsDistr, 
    (a, b) => a > b, "少", 
    (a, b) => a < b, "多"
  );
  const numOfExamsWording = getNumWording(numOfExams, rankingResNumOfExams);

  const numOfHours = getNumOfHours(exams);
  const numOfOnlineExams = getNumOfOnlineExams(exams);

  const goHomeDate = getGoHomeDate(exams);
  const rankingResGoHomeDate = getLargerRankingRes(
    goHomeDate, 
    goHomeDateDistr, 
    (a, b) => a > b, "早",
    (a, b) => a < b, "晚"
  );
  const goHomeDateWording = getHomeDateWording(goHomeDate, rankingResGoHomeDate);

  const dateSpan = getDateSpan(exams);
  const rankingResDateSpan = getLargerRankingRes(
    dateSpan, 
    dateSpanDistr, 
    (a, b) => a > b, "短",
    (a, b) => a < b, "长"
  );
  const dateSpanWording = getDateSpanWording(dateSpan, rankingResDateSpan);

  const footnote = getFootnote();

  return {
    numOfExams,
    numOfHours,
    numOfOnlineExams,
    numOfExamsWording,
    goHomeDateWording,
    dateSpanWording,
    footnote,
  };
};

export { getStats, getExamStats }
export default getStats
