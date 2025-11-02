import { Select, type ComboboxData } from "@mantine/core";
import { useState } from "react";

interface IProps {
  title: string;
  data?: ComboboxData;
  onChange: (value: string | null) => void;
}

const Filter = ({ title, data, onChange }: IProps) => {
  const [value, setValue] = useState<string | null>();

  const handleChange = (value: string | null) => {
    setValue(value);
    onChange(value);
  };

  return (
    <Select
      placeholder={`Filter by ${title}`}
      data={data}
      value={value}
      onChange={handleChange}
    />
  );
};

export default Filter;
