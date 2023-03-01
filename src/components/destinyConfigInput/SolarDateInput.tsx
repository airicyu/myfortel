import { Select, Checkbox } from "antd";
import { useCallback } from "react";
import { arrayRange } from "../../util/numberUtils";

const yearOptions = arrayRange(1900, 2050).map((num) => {
  return { label: "" + num, value: num };
});

const monthOptions = arrayRange(1, 12).map((num) => {
  return { label: "" + num, value: num };
});

const dayOptions = arrayRange(1, 31).map((num) => {
  return { label: "" + num, value: num };
});

export const SolarDateInput = ({
  year,
  month,
  day,
  onChangeYear,
  onChangeMonth,
  onChangeDay,
}: {
  year: number | null;
  month: number | null;
  day: number | null;
  onChangeYear: (value: number) => void;
  onChangeMonth: (value: number) => void;
  onChangeDay: (value: number) => void;
}) => {
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
          optionFilterProp="label"
          onChange={onChangeDay}
          filterOption={(input, option) =>
            ("" + (option?.value ?? "")).startsWith(input)
          }
          options={dayOptions}
          value={day}
          style={{ width: 100 }}
        />
      </div>
    </div>
  );
};
