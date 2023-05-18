import React,{forwardRef,useEffect,useState} from 'react'
// import axios from 'axios'
import {   Form,  Select,Input} from 'antd'
const  UserForm=forwardRef((props,ref) => {
    const {Option}=Select
    const [isDisable,setisDisable]=useState(false)
    const {roleId,regions}=JSON.parse(localStorage.getItem("token"))
    useEffect(()=>{
      setisDisable(props.isupdateDisabled)
    },[props.isupdateDisabled])
    const checkRegionDisabled = (item) => {

      if (roleId === 1) {
          return false
      } else {
          return item.value === regions

      }
  }
  const checkRoleDisabled = (item) => {
      if (roleId === 1) {
          return false
      } else {
          return item.id === 1 || item.id === 2
      }
  }
  return (
    <Form
    ref={ref}
    //垂直布局
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisable?[]:[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select disabled={isDisable}>
          {
            props.regionList.map(item=>
            <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>
              {item.title}
            </Option>)
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[{ required: true,
            message: 'Please input the title of collection!',}]}
      >
        <Select onChange={(value)=>{
            if(value===1){
                setisDisable(true)
                ref.current.setFieldsValue({
                    region:''
                })
            }else{
                setisDisable(false)
            }
        }}>
          {
            props.roleList.map(item=>
            <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>
              {item.roleName}
            </Option>)
          }
        </Select>
      </Form.Item>
    </Form>
  )
})
export default UserForm
