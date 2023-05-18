import { React } from 'react'
// import type { MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Layout, theme, Dropdown, Avatar, Menu } from 'antd';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
const { Header } = Layout;
function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem("token"));
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // const changeCollapsed()=>{
  //   setCollapsed(!collapsed)
  // }
  // const { role: { roleName }} = JSON.parse(localStorage.getItem("token"))
  const changeCollapsed=()=>{
    //改变state的isCollapsed
    props.changeCollapsed()
  }
  const menu = (
    <Menu>

      <Menu.Item disabled>
        {roleName}
      </Menu.Item>

      <Menu.Item danger onClick={() => {
        localStorage.removeItem("user")
        props.history.replace("/login")
        console.log(props.history);
      }}>
        退出

      </Menu.Item>
    </Menu>
  )
  return (
    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed}/> : <MenuFoldOutlined onClick={changeCollapsed} />}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{ color: "#1890FF" }}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size={36} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>

  )
}
/**
 * connect(
 *  mapStateToProps
 *  mapDispatchToProps
 * )(被包装的组件)
 */
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}
const mapDispatchToProps={
  changeCollapsed(){
        return {
          type:"change_collapsed"
        }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
