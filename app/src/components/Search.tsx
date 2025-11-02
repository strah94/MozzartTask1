import { TextInput } from "@mantine/core";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface IProps {
  title: string;
  onChange: (value: string) => void;
  onSeearch: () => void;
}

const Search = ({ title, onChange, onSeearch }: IProps) => {
  const [value, setValue] = useState<string>();

  const handleChange = (value: string) => {
    setValue(value);
    onChange(value);
  };

  return (
    <TextInput
      w={300}
      value={value}
      placeholder={`Search by ${title}`}
      onChange={(event) => handleChange(event.currentTarget.value)}
      rightSection={<FaSearch onClick={onSeearch} />}
    />
  );
};

export default Search;
