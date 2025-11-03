import { TextInput } from "@mantine/core";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface IProps {
  title: string;
  onSearch: (value?: string) => void;
}

const Search = ({ title, onSearch }: IProps) => {
  const [value, setValue] = useState<string>("");

  return (
    <TextInput
      w={300}
      value={value}
      placeholder={`Search by ${title}`}
      onChange={(event) => setValue(event.currentTarget.value)}
      rightSection={
        <FaSearch
          style={{ cursor: "pointer" }}
          onClick={() => onSearch(value)}
        />
      }
    />
  );
};

export default Search;
