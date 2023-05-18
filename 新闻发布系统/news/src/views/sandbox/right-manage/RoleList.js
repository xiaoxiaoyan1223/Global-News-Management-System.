import React ,{useState,useEffect}from 'react'
import {Table,Button,Modal,Tree} from 'antd'
import {DeleteOutlined,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import axios from 'axios'
const {confirm}=Modal
export default function RoleList() {
  const [dataSource,setdataSource]=useState([])
  const [isModalVisible,setisModalVisible]=useState(false)
  const [rightList,setrightList]=useState([])
  const [currentRights,setcurrentRights]=useState([])
  const [currentId, setcurrentId] = useState(0)
  useEffect(()=>{
    axios.get("/roles").then(res=>{
      setdataSource(res.data)
    })
  },[])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      setrightList(res.data)
    })
  },[])
  const columns=[
    {
      title:'ID',
      dataIndex:'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title:'角色名称',
      dataIndex:'roleName'
    },
    {
        title: '操作',
        render:(item)=>{
          return <div>
            <Button danger shape="circle" icon={<DeleteOutlined/>}
            onClick={()=>{confirmMethod(item)}}/>
            <Button type='primary' shape="circle" icon={<EditOutlined/>}
          onClick={()=>{
            setisModalVisible(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }}  style={{ marginLeft: "10px" }} /> 
          </div>
      },
    }
  ]
  
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
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`/roles/${item.id}`)
  }
  const handleOk=()=>{
    setisModalVisible(false);
    setdataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  }
  const handleCancel=()=>{
    setisModalVisible(false);
  }
  const onCheck=(checkKeys)=>{
    setcurrentRights(checkKeys.checked)
    
  }
  return (
    <div>
        <Table dataSource={dataSource} columns={columns}
        rowKey={(item)=>item.id}></Table>
        <Modal title="权限分配" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          CheckedKeys={currentRights}
          onCheck={onCheck}
          treeData={rightList}
          />
      </Modal>
    </div>
  )
}
