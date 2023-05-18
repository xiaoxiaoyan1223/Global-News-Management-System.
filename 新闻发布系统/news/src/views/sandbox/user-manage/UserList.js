import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Modal, Switch } from 'antd'
import axios from "axios"
import UserForm from '../../../components/user-manage/UserForm'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
// import { Switch } from 'react-router-dom'
const { confirm } = Modal
// const [form] = Form.useForm();
export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [IsModalOpen, setIsModalOpen] = useState(false)
  const [UpdateOpen,setIsUpdateOpen]=useState(false)
  const addForm = useRef(null)
  const updateForm=useRef(null)
  const [current,setcurrent]=useState(null)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const {roleId,regions,username}=JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get("/regions").then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])
  useEffect(() => {
    axios.get("/roles").then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])
  useEffect(() => {
    const roleObj = {
      "1": "a",
      "2": "b",
      "3": "c",
      "4": "d",
    }
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      setdataSource(roleObj[roleId] === "a" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => roleObj[item.roleId] === "c" || roleObj[item.roleId] === "d"),

      ])
    })
  }, [roleId, regions, username])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:'全球',
          value:'全球'
        }
      ],
      onFilter:(value,item)=>{
        if(value==="全球"){
          return item.region===""
        }
        return item.region===value
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />}
            onClick={() => { confirmMethod(item) }} disabled={item.default} />

          <Button type='primary' shape="circle" icon={<EditOutlined />} style={{ marginLeft: "10px" }}
            disabled={item.default} onClick={() => handleUpdate(item)}></Button>
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
 
  const handleUpdate = (item) => {
    //用延时器是为了让里面操作变成同步触发，而不是合并触发
    setIsUpdateOpen(true)
    setTimeout(()=>{
      updateForm.current.setFieldsValue(item)
    },0)
    setcurrent(item)
  }
  const updateFormOk=()=>{
    updateForm.current.validateFields().then(value=>{
      // console.log(value)
      setIsModalOpen(false)
      setdataSource(dataSource.map(item=>{
        if(item.id===current.id){
         return {
          ...item,
          ...value,
          role:roleList.filter(data=>data.id===value.roleId)[0]
         }
        }
        return item
      }))
      axios.patch(`/users/${current.id}`,
        value
      )
    })
  }
  const handleChange = (item) => {
    // console.log(item);
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() { },
    });
  }
  const addFormOk = () => {
    // console.log('ok');
    addForm.current.validateFields().then(value => {
      setIsModalOpen(false)
      addForm.current.resetFields()
      //post到后端，生成id，再设置datasource，方便后面的删除或者更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false
      }).then(res => {
        setdataSource([...dataSource, { ...res.data, role: roleList.filter(item => item.id === value.roleId)[0] }])
      })
    }).catch(err => {
      console.log(err);
    })
  }
  const deleteMethod = (item) => {
    //删除后当前页面同步和后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)

  }
  return (
    <div>
      <Button type='primary' onClick={() => { setIsModalOpen(true) }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} />
      <Modal
        // open={open}
        open={IsModalOpen}
        title="用户信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsModalOpen(false)
        }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
      <Modal
        // open={open}
        open={UpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateOpen(false)
        }}
        onOk={updateFormOk}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm}></UserForm>
      </Modal>
    </div>

  )
}
