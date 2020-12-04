import { Calendar, Select, Radio, Col, Row, Typography } from "antd"
import "antd/dist/antd.css"
import React, { useState , useContext} from "react"
import {currentDateTime} from "../../pages/index"
import moment from "moment"

function onPanelChange(value: any, mode: any) {
  console.log(222222222222)
}

function SidebarCalendar() {
  // 取得時間
  //const currentDateTime = moment().format("YYYY/MM/DD HH:mm:ss")
  const test = useContext(currentDateTime)
  const [value, setValue] = useState(currentDateTime)
  const [selectedValue, setSelectedValue] = useState(currentDateTime)
  // eslint-disable-next-line prettier/prettier
  function onSelect(value) {
    console.log(test)
    setValue(value)
    setSelectedValue(value)
    console.log(value)
  }
  return (
    <div className="site-calendar-customize-header-wrapper">
      <Calendar
        fullscreen={false}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const start = 0
          const end = 12
          const monthOptions = []

          const current = value.clone()
          const localeData = value.localeData()
          const months = []
          for (let i = 0; i < 12; i += 1) {
            current.month(i)
            months.push(localeData.monthsShort(current))
          }

          for (let index = start; index < end; index += 1) {
            monthOptions.push(
              <Select.Option className="month-item" key={`${index}`}>
                {months[index]}
              </Select.Option>
            )
          }
          const month = value.month()

          const year = value.year()
          const options = []
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>
            )
          }

          return (
            <div style={{ padding: 8 }}>
              <Typography.Title level={4}>Custom header</Typography.Title>
              <Row gutter={8}>
                <Col>
                  <Radio.Group size="small" onChange={e => onTypeChange(e.target.value)} value={type}>
                    <Radio.Button value="month">Month</Radio.Button>
                    <Radio.Button value="year">Year</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    onChange={newYear => {
                      const now = value.clone().year(newYear)
                      onChange(now)
                    }}
                    value={String(year)}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    value={String(month)}
                    onChange={selectedMonth => {
                      const newValue = value.clone()
                      newValue.month(parseInt(selectedMonth, 10))
                      onChange(newValue)
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
              </Row>
            </div>
          )
        }}
        onPanelChange={onPanelChange}
        onSelect={onSelect}
      />
    </div>
  )
}
export default SidebarCalendar
