import { Select, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useCallback } from "react";
import {
  arrayRange,
  CHINESE_DAYS_OF_MONTH,
  CHINESE_ONE_TO_TWELVE,
} from "../../util/numberUtils";

const yearOptions = arrayRange(1900, 2050).map((num) => {
  return { label: "" + num, value: num };
});

const monthOptions = arrayRange(1, 12).map((num) => {
  return { label: CHINESE_ONE_TO_TWELVE[num - 1], value: num };
});

const dayOptions = arrayRange(1, 30).map((num) => {
  return { label: CHINESE_DAYS_OF_MONTH[num - 1], value: num };
});

export const LunarDateInput = ({
  year,
  month,
  day,
  leap,
  onChangeYear,
  onChangeMonth,
  onChangeDay,
  onChangeLeap,
}: {
  year: number | null;
  month: number | null;
  day: number | null;
  leap: boolean;
  onChangeYear: (value: number) => void;
  onChangeMonth: (value: number) => void;
  onChangeDay: (value: number) => void;
  onChangeLeap: (value: boolean) => void;
}) => {
  const _onChangeLeap = useCallback(
    (e: CheckboxChangeEvent) => {
      onChangeLeap(e.target.checked);
    },
    [onChangeLeap]
  );

  return (
    <div>
      <div>
        {" 年: "}
        <Select
          placeholder="年份"
          optionFilterProp="label"
          onChange={onChangeYear}
          // filterOption={(input, option) =>
          //   (option?.label ?? "").startsWith(input)
          // }
          options={yearOptions}
          value={year}
          style={{ width: 80 }}
        />

        {" 月: "}
        <Select
          placeholder="月份"
          onChange={onChangeMonth}
          options={monthOptions}
          value={month}
          style={{ width: 80 }}
        />

        {" 日: "}
        <Select
          placeholder="日子"
          onChange={onChangeDay}
          filterOption={(input, option) =>
            ("" + (option?.value ?? "")).startsWith(input)
          }
          options={dayOptions}
          value={day}
          style={{ width: 100 }}
        />
        <div
          className="inline-block"
          style={{ paddingLeft: 10, paddingRight: 10 }}
        ></div>
        <Checkbox checked={leap} onChange={_onChangeLeap}>
          閏月
        </Checkbox>
      </div>
    </div>
  );
};
