const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()
// 这是一个播放器
// const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  // 初始化数据
  data: {
    row: 3, // 多少行
    column: 3, // 多少列
    bakMusErr: 'http://s.aigei.com/pvaud_mp3/aud/mp3/12/1275113c61f641268aaf0234627a60bf.mp3?download/%E6%8C%89%E9%92%AE%E7%B1%BB6_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.mp3&e=1531066140&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:8SdibI7LwVHegrxvk22tK7o9-FY=',
    bakMusRig: 'http://s.aigei.com/pvaud_mp3/aud/mp3/5e/5e1a283606014492b21476e6cb3109fd.mp3?download/v%E9%85%8D%E9%9F%B3-%E5%A5%B3%E6%94%BB%E5%87%BB-%E8%BD%BB-001_%E7%88%B1%E7%BB%99%E7%BD%91_aigei_com.mp3&e=1531064940&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:SvHFOzLJ-i6VD5Oe7mpsKgykVDA='

  },
  onLoad: function() {
    var height = wx.getSystemInfoSync().windowHeight
    var width = wx.getSystemInfoSync().windowWidth;
    //console.log(width / 3)
    var itemHeight = parseInt(width / 3)
    // 高度进行平分
    var rh = Math.round(height / itemHeight) // parseInt(height / 100)
    //console.log(height / itemHeight)
    //console.log(rh)
    // 随机一个图片
    var rg = 4 //(Math.floor(Math.random() * 3 + 1))
    // console.log(rg)
    this.setData({
      row: rh,
      imgIndex: rg,
      itemHeight: itemHeight
    })
    this.onChooseOne()

  },
  onClickImg: function(event) {
    //console.log(event)

    var row = event.currentTarget.dataset.row;
    var column = event.currentTarget.dataset.column;
    //console.log(row)
    // console.log(column)

    var selData = this.data.selData;
    if (selData.selR == row && selData.selC == column) {
      this.playMusic(this.data.bakMusRig)
      this.onChooseOne()
    } else {
      this.playMusic(this.data.bakMusErr)
      //this.checkMusic()
    }
  },

  onChooseOne: function() {
    // 随机选择一个进行图片渲染
    var selData = this.onSelect()
    //console.log(selData)

    while (true) {
      var selDataOld = this.data.selData;
      if (selDataOld == undefined) {
        break;
      }
      if (selDataOld.selR == selData.selR && selDataOld.selC == selData.selC) {
        selData = this.onSelect()
        console.log("重新生成一次")
      } else {
        break;
      }
    }

    // console.log(selData)
    this.setData({
      selData: selData
    })

    var imgList = new Array(); //声明一维数组        
    for (var x = 0; x < this.data.row; x++) {
      imgList[x] = new Array(); //声明二维数组
      for (var y = 0; y < this.data.column; y++) {
        imgList[x][y] = {
          src: '',
          style: 'flex-item bc_peachpuff btn-fill-horz'
        }; //数组初始化为空
      }
    }

    imgList[selData.selR][selData.selC].src = '../images/' + this.data.imgIndex + '.png'
    imgList[selData.selR][selData.selC].style = 'flex-item bc_peachpuff  btn-fill-horz'
    // 图片结果
    this.setData({
      imgList: imgList
    })

  },

  onSelect: function() {
    // 随机选择一个位置
    var row = this.data.row;
    var column = this.data.column;
    //console.log(row)
    //console.log(column)
    var rg = (Math.floor(Math.random() * row))
    var cg = (Math.floor(Math.random() * column))
    return {
      selR: rg,
      selC: cg
    }
  },

  playMusic: function(url) {
    //console.log("sssss")

    innerAudioContext.stop()
    innerAudioContext.autoplay = true
    innerAudioContext.src = url
    //../media/1.mp3
    innerAudioContext.onPlay(() => {
      // console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    //innerAudioContext.play()
  },

  checkMusic: function() {
    var bakMusErr = this.data.bakMusErr
    console.log(bakMusErr)
    wx.downloadFile({
      url: bakMusErr, //仅为示例，并非真实的资源
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log(res.tempFilePath)
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      }
    })
  }

})