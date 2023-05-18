import React, { useEffect, useState, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as Echarts from 'echarts'
//js高性能处理库
import _ from 'lodash'
const { Meta } = Card
export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  // const [visible, setvisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [pieChart, setpieChart] = useState(null)
  const [allList, setallList] = useState([])
  const barRef = useRef()
  const pieRef=useRef()
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
      setviewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
      setstarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then(res => {
      console.log(res.data);
      //对数据res.data进行分组 后面参数说明分组依据
      // console.log(_.groupBy(res.data,item=>item.category.title));
      renderBarView(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
      // console.log(allList,'111');
      //当关闭窗口后会销毁组件 
      return () => {
        window.onresize = null
      }
    })
  }, [])
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLable: {
          rotate: "45",
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onresize = () => {
      //实现图表自适应
      myChart.resize()
    }
  }
  const renderPieView = () => {
    //处理数据
    var currentList = allList.filter(item => item.author === username)
    console.log(currentList,'22');
    var groupObj = _.groupBy(currentList, item => item.category.title)
    var list = []
    for (var i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    var myChart
    
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current)
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;
    option = {
      title: {
        text: '我的新闻分布图',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={viewList}
              renderItem={(item) => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}> {item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              bordered
              dataSource={starList}
              renderItem={(item) => <List.Item>
                <a href={`#/news-manage/preview/${item.id}`}> {item.title}</a>
              </List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              width: 300,
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              
              <SettingOutlined key="setting" onClick={() => {
                //在延时器里面可以让dom和渲染同步
                setOpen(true)
                setTimeout(() => {
                  
                  //init初始化
                  renderPieView()
                }, 0)
              }} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
              title={username}
              description={
                <div>
                  <b>{region === '' ? '全球' : region}</b>
                  {roleName}
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setOpen(false)
        }}
        open={open} >
        <div ref={pieRef} style={{
          width: '100%',
          height: '400px',
          marginTop: "30px "
        }}></div>
      </Drawer>
      <div ref={barRef} style={{
        width: '100%',
        height: '300px',
        marginTop: "140px "
      }}>
      </div>
    </div>
  )
}
