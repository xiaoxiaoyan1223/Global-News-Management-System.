import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { Button, Table ,Tag,notification} from 'antd'
import DrawerPanel from 'antd/es/drawer/DrawerPanel'
export default function AuditList(props) {
  const [dataSource,setdataSource]=useState([])
  const {username}=JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios(`/nnews?author=${username}&auditState_ne=0&publishStaState_lte=1&_expand=category`).then(res=>{
      console.log(res.data);
      setdataSource(res.data)
    })
  },[username])
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
      title: '审核状态',
      dataIndex: 'auditState',
      render:(auditState)=>{
        const colorList=['','orange','green','red']
        const auditList=['草稿箱','审核中','已通过','未通过']
        return <Tag color={colorList[auditState]}>{auditState[auditList]}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div>
          {
            item.auditState===1&& <Button dange onClick={()=>handleRevert(item)}>撤销</Button>
          }
          {
            item.auditState===2&& <Button onClick={()=>handlePublished(item)}>发布</Button>
          }
          {
            item.auditState===3&& <Button type='prime' onClick={()=>handleUpdate(item)}>更新</Button>
          }
         
        </div>
      }
    },
  ];
  const handleRevert=(item)=>{
    setdataSource(dataSource.filter(data=>DrawerPanel.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message:`通知`,
        description:
        `您可以到草稿箱中查看到您的新闻`,
        placement:'bottomRight'
      })
    })
  }
  const handleUpdate=(item)=>{
    props.history.push(`/news-manage/update/${item.id}`)
  }
  const handlePublished=(item)=>{
    axios.patch(`/news/${item.id}`,{
      "publishState": 2,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      
    }).then(res=>{
      props.history.push('/publish-manage/published')
      notification.info({
        message: `通知`,
        description:`您可以到发布管理/已发布中查看您的新闻`,
        placement:"bottomRight",
      });
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
