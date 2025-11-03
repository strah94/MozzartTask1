import { Select, type ComboboxData } from "@mantine/core";

interface IProps {
  title: string;
  data?: ComboboxData;
  onChange: (value: string | null) => void;
}

const Filter = ({ title, data, onChange }: IProps) => {
  return (
    <Select
      placeholder={`Filter by ${title}`}
      data={data}
      onChange={onChange}
    />
  );
};

export default Filter;
