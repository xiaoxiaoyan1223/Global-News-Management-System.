import React, {useState,useEffect}from 'react'
import { Button, Table ,Modal, notification} from 'antd'
import axios from "axios"
import {DeleteOutlined,UploadOutlined,ExclamationCircleOutlined,EditOutlined} from '@ant-design/icons'
// import { Switch } from 'react-router-dom'
const {confirm}=Modal
export default function NewsDraft(props) {
  const [dataSource,setdataSource]=useState([])
  const {username}=JSON.parse(localStorage.getItem("token"))

  useEffect(()=>{
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
      const list=res.data
      setdataSource(list)
    })
  },[username])

  const handleCheck=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res=>{
      props.history.push('/audit-manage/list')
      notification.info({
        message:`通知`,
        description:
        `您可以到审核列表中查看到您的新闻`,
        placement:'bottomRight'
      })
    })
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b> 
      }
    },
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
      title: '分类',
      dataIndex: 'category',
      render:(category)=>{
       return  category.title
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>}
          onClick={( )=>{confirmMethod(item)}}/>
          <Button danger shape="circle" icon={<EditOutlined/>}  onClick={ props.history.push(`/news-manage/update/${item.id}`)}/>
          <Button type='primary' shape="circle" icon={<UploadOutlined />} 
          onClick={()=>handleCheck(item.id)} ></Button>
          
        </div>
      }
    },
  ];
  // const switchMethod=(item)=>{
  //   item.pagepermisson=item.pagepermisson===1?0:1;
  //   console.log(item.pagepermisson);
  //   setdataSource([...dataSource])
  //   if(item.grade===1){ 
  //     //patch是补丁的更新
  //     axios.patch(`/rights/${item.id}`,{
  //       pagepermisson:item.pagepermisson
  //     })
  //   }else{
  //     axios.patch(`/children/${item.id}`,{
  //       pagepermisson:item.pagepermisson
  //     })
  //   }
  // }
  const confirmMethod=(item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {},
    });
  }
  const deleteMethod=(item)=>{
    //删除后当前页面同步和后端同步
    if(item.grade===1){
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`/news/${item.id}`)
    }else{
      // console.log(item.rightId);
      //找到了上一级
      let list=dataSource.filter(data=>data.id===item.rightId)
      //找出要删除的孩子节点
      list.children=list.children.filter(data=>data.id!==item.id)
      setdataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  
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
