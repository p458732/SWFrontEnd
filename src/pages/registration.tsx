import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import "antd/dist/antd.css"
import { FormInstance } from "antd/lib/form"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Form, Input, Button, Checkbox, Layout, Row, Col, Image, Tooltip, Cascader, Select } from "antd"
import "./login.css"
import { header, Department } from "../component/utils/interface"
import { QuestionCircleOutlined } from "@ant-design/icons"
const { Header, Footer, Sider, Content } = Layout
const { Option } = Select
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

const getDepartmentURL = "https://hw.seabao.ml/api/department"
const registrationURL = "https://hw.seabao.ml/api/user"

const generateOption = (members: string[]) => {
  return members.map(member => {
    return <Option value={member}>{member}</Option>
  })
}

const RegistrationForm = () => {
  const [form] = Form.useForm()
  const [member, setMember] = useState<string[]>([])
  const registrationInfor = {
    name: '',
    email: '',
    departmentName:'',
    password: '',
  }
  const getDepartmentList = () => {
    var departmentList = [];
    fetch(getDepartmentURL, {
      method: 'GET',
      headers: header,
    })
    .then(res => {
      return res.json()
    })
      .then(List => {
        setMember(List.map((l: Department) => l.name))
      })
      .catch(err => {
        alert("getDepartment error!")
      })
  }
  useEffect(() => {
    getDepartmentList();
  }, [])

  const onFinish = values => {
    console.log("Received values of form: ", values)
  }
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 500,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  )
  function nameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    registrationInfor.name = e.target.value;
  }
  function emailChanged(e: React.ChangeEvent<HTMLInputElement>) {
    registrationInfor.email = e.target.value;
  }
  function passwordChanged(password:string) {
    registrationInfor.password = password;
  }
  function departmentNameChanged(value , option) {
    registrationInfor.departmentName = value;
  }
  function sendRegisterRequest() {
    fetch(registrationURL, {
      method: 'POST',
      body: JSON.stringify(registrationInfor),
      headers: header,
    })
      .then(res => {
        if (res.status === 500) {
          alert("信箱已存在")
        }
        if (res.status === 400) {
          alert("未知錯誤")
        }
        if (res.status === 200) {
          //返回登入畫面
        }
      })
      
  }
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ["zhejiang", "hangzhou", "xihu"],
        prefix: "86",
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label={<span>Name&nbsp;</span>}
        rules={[
          {
            required: true,
            message: "Please input your name!",
            whitespace: true,
          },
        ]}
      >
        <Input onChange={ nameChanged}/>
      </Form.Item>
      <Form.Item
        name="email"
        label="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid Email!",
          },
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input onChange={ emailChanged}/>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                passwordChanged(value);
                return Promise.resolve()
              }
              return Promise.reject("The two passwords that you entered do not match!")
            },
          }),
        ]}
      >
        <Input.Password />
        
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select your department"
        optionFilterProp="children"
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={departmentNameChanged}
      >
        {generateOption(member)}
      </Select>
        <Button type="primary" htmlType="submit" onClick={ sendRegisterRequest}>
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
export default RegistrationForm
