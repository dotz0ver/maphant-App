import React, { useCallback, useEffect, useState } from "react";
import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

import { dataResponse } from "../../Api/fetchAPI";
import Search from "./Search";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchByFilter = (props: any) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<TAutocompleteDropdownItem[]>([]);

  const setFieldValueInterceptor = (name: string, value: string) => {
    setSearch(value);

    setFieldValue(name, value);
  };

  const {
    list,
    form: { setFieldValue },
  } = props;

  useEffect(() => {
    props.list().then((res: dataResponse) => {
      setData(res.data as string[]);
    });
  }, [list]);

  const updateSearch = useCallback(
    (text: string) => {
      // 검색어를 이용하여 데이터를 필터링
      const filteredItems = data.filter(item => item.includes(text));
      const formattedData = filteredItems
        .map((item, index) => ({
          id: index.toString(),
          title: item.toString(),
        }))
        .flat();
      setFilteredData(formattedData);
    },
    [data],
  );

  useEffect(() => {
    updateSearch(search);
  }, [search]);

  const propsPassed = { ...props };
  propsPassed.form.setFieldValue = setFieldValueInterceptor;
  propsPassed.list = filteredData;

  return <Search list={filteredData} {...propsPassed} />;
};

export default SearchByFilter;
