import { Calendar, Select, Radio, Col, Row } from "antd"
import "antd/dist/antd.css"
import React from "react"

/** @file calendar.tsx
  * @brief implement the SidebarCalendar
   
  * @author Hong Eric
  * @date 2021-01-08
  * */

function SidebarCalendar(props: any) {
  // 取得時間

  // eslint-disable-next-line prettier/prettier
  //------------------------------------------------------------------------------------------------------------
  /** @brief 
      change the current date value
  * @param param_in  None
  * @return None */
  function onSelect(value: any) {
    props.currentDate.setVal(value)
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
          // set Calendar
          for (let i = 0; i < 12; i += 1) {
            current.month(i)
            months.push(localeData.monthsShort(current))
          }

          for (let index = start; index < end; index += 1) {
            monthOptions.push(
              <Select.Option className="month-item" value={`${index}`} key={`${index}`}>
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
                    onChange={(newYear: any) => {
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
        onSelect={value => {
          onSelect(value)
        }}
      />
    </div>
  )
}
export default SidebarCalendar
