import React,{useEffect,useState} from 'react'
import axios from 'axios'
import {Button,Table ,Tag,notification} from 'antd'
export default function Audit() {
  const [dataSource, setdataSource] = useState([])
  const {roleId,regions,username}=JSON.parse(localStorage.getItem("token"))
  useEffect(()=>{
    const roleObj = {
      "1": "a",
      "2": "b",
      "3": "c",
      "4": "d",
    }
    axios.get(`/news?audilState=1&_expand=category`).then(res=>{
      const list = res.data
      setdataSource(roleObj[roleId] === "a" ? list : [
        ...list.filter(item => item.author === username),
        ...list.filter(item => roleObj[item.roleId] === "c" || roleObj[item.roleId] === "d"),

      ])
    })
  },[roleId,regions,username])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a> 
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render:(key)=>{
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button type='primary' onClick={()=>handleAudit(item,2,1)}>通过</Button>
          <Button dange onClick={()=>handleAudit(item,3,0)}>驳回</Button>
        </div>
      }
    },
  ];
  const handleAudit=(item,auditState,publishState)=>{
    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch( `/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
        message:`通知`,
        description:
        `您可以到[审核列表/审核管理]中查看到您的新闻的审核状态`,
        placement:'bottomRight'
      })
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
      pagination={{
        pageSize:5
      }}
      rowKey={item=>item.id} />
    </div>
  )
}
