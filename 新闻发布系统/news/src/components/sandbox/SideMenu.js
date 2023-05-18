import {React,useState,useEffect} from 'react'
// import { withRouter } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import axios from 'axios'
import './index.css'
import {connect} from 'react-redux'
import {
  HomeOutlined,
  SlidersOutlined,
  TeamOutlined,
  UserOutlined,
  FileProtectOutlined,
  EditOutlined,
  SelectOutlined,
  UnorderedListOutlined,
  UnlockOutlined,
  ProfileOutlined,
  FundViewOutlined,
  FontSizeOutlined,
  ApartmentOutlined,
  HistoryOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import {  Layout, Menu } from 'antd';
const {role:{rights}}=JSON.parse(localStorage.getItem("token"));
const {  Sider  } = Layout;
const {SubMenu}=Menu
//模拟数据结构
// const menuList=[
//   {
//   key:'/home',
//   title:"首页",
//   icon:<UserOutlined/>
//   },
//   {
//     key:'/user-manage',
//     title:"用户管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:'/user-manage/list',
//         title:"用户列表",
//         icon:<UserOutlined/>
//         },
//     ]
//   },
//   {
//     key:'/right-manage',
//     title:"权限管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:'/right-manage/role/list',
//         title:"角色列表",
//         icon:<UserOutlined/>
//       },
//       {
//         key:'/right-manage/right/list',
//         title:"权限列表",
//         icon:<UserOutlined/>
//         },
//     ]
//   },
// ]
const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UnorderedListOutlined />,
  "/authority-manage": <SlidersOutlined />,
  "/authority-manage/role/list": <TeamOutlined />,
  "/authority-manage/authority/list": <UnlockOutlined />,
  "/news-manage": <EditOutlined />,
  "/news-manage/add": <FontSizeOutlined />,
  "/news-manage/draft": <EditOutlined />,
  "/news-manage/category": <ApartmentOutlined />,
  "/audit-manage": <FileProtectOutlined />,
  "/audit-manage/audit": <FundViewOutlined />,
  "/audit-manage/list": <ProfileOutlined />,
  "/publish-manage": <SelectOutlined />,
  "/publish-manage/unpublished": <HistoryOutlined />,
  "/publish-manage/published": <CloudUploadOutlined />,
  "/publish-manage/sunset": <CloseCircleOutlined />
}

 function SideMenu(props) {
  const [menu,setMenu]=useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      console.log(res.data);
      setMenu(res.data)
    })
  },[])
  // const navigate = useNavigate()
  const checkPagePermission=(item)=>{
    //既要判断侧边栏用不用展示还要判断他的权限里面有没有这块
    return item.pagepermisson && (Array.isArray(rights) ? rights : rights.checked).includes(item.key)
  }
  const renderMenu=(menuList)=>{
    return menuList.map(item=>{
      if(item.children?.length>0 &&Boolean(checkPagePermission(item))){
        return <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return Boolean(checkPagePermission(item)) &&<Menu.Item key={item.key} icon={iconList[item.key]}
      onClick={()=>{props.history.push(item.key)}}> {item.title}</Menu.Item>
    })
  }
  const selectKeys=[props.location.pathname]
  const openKeys=["/"+props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">{props.isCollapsed===false?'全球新闻后台管理系统':'新闻'}</div>
        <div style={{ flex: "1", overflow: "auto" }}>
          <Menu
            theme="dark"
            selectedKeys={selectKeys}
            mode="inline"
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
    isCollapsed
})
export default connect(mapStateToProps)(withRouter(SideMenu))
 
