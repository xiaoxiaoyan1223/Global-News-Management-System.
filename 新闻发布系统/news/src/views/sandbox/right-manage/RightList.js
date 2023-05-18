import React, {useState,useEffect}from 'react'
import { Button, Table ,Tag,Modal, Popover,Switch} from 'antd'
import axios from "axios"
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
// import { Switch } from 'react-router-dom'
const {confirm}=Modal
export default function RightList() {
  const [dataSource,setdataSource]=useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      const list=res.data
      list.forEach(item=>{
        if(item.children.length===0){
          item.children=''
        }
      })
      setdataSource(list)
    })
  },[])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b> 
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render:(key)=>{
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined/>}
          onClick={( )=>{confirmMethod(item)}}/>
          <Popover content={
            <div style={{textAlign:"center"}}>
              <Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}}></Switch>
            </div>} 
          title='配置项' trigger={item.pagepermisson===undefined?'':'click'}>
            <Button type='primary' shape="circle" icon={<EditOutlined/>} 
             disabled={item.pagepermisson===undefined}
           ></Button>
          </Popover>
          
        </div>
      }
    },
  ];
  const switchMethod=(item)=>{
    item.pagepermisson=item.pagepermisson===1?0:1;
    console.log(item.pagepermisson);
    setdataSource([...dataSource])
    if(item.grade===1){ 
      //patch是补丁的更新
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }
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
      axios.delete(`/rights/${item.id}`)
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
