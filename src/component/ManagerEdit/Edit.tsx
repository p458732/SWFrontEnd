/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useState } from "react"
import "antd/dist/antd.css"
import "./Edit.css"
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Space,
  Row,
  Col,
} from "antd"

const tailLayout = {
  wrapperCol: { offset: 13, span: 16 },
}

const Edit = (data: any) => {
  const [componentSize, setComponentSize] = useState("default")

  function onChange(value: any) {
    console.log(value)
  }

  const onFormLayoutChange = ({ size }: { size: any }) => {
    setComponentSize(size)
  }

  return (
    <>
      <Form
        labelCol={{
          span: 4,
          offset: 1,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
      >
        <div className="smallbox">
          <Row justify="center">
            <h1>From</h1>
          </Row>
          <Form.Item label="Input">
            <Input />
          </Form.Item>
          <Form.Item label="Select">
            <Select>
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="TreeSelect">
            <TreeSelect
              treeData={[
                {
                  title: "Light",
                  value: "light",
                  children: [
                    {
                      title: "Bamboo",
                      value: "bamboo",
                    },
                  ],
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Cascader">
            <Cascader
              options={[
                {
                  value: "zhejiang",
                  label: "Zhejiang",
                  children: [
                    {
                      value: "hangzhou",
                      label: "Hangzhou",
                    },
                  ],
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="DatePicker">
            <DatePicker onChange={onChange} />
          </Form.Item>
          <Form.Item label="InputNumber">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Switch">
            <Switch />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space size="middle">
              <Button onClick={() => console.log(data)} type="default">
                Cancel
              </Button>
              <Button onClick={() => console.log(data)} type="primary">
                Confrim
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </>
  )
}

export default Edit
