import { SearchBar } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

type Props = {
  field: unknown;
  form: unknown;
  list: TAutocompleteDropdownItem[];
  onChangeText: (text: string) => void;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Search: React.FC<Props> = props => {
  const [search, setSearch] = useState("");
  const handleItemClick = (itemTitle: string) => {
    setSearch(itemTitle);
    setFieldValue(name, itemTitle);
  };

  const {
    // @ts-ignore
    field: { name, onBlur, value },
    // @ts-ignore
    form: { setFieldValue, setFieldTouched },
    list,
    onChangeText,
    ...inputProps
  } = props;

  const onChangeTextInterceptor = (text: string) => {
    setSearch(text);
    setFieldValue(name, text);

    if (onChangeText) onChangeText(text);
  };

  useEffect(() => {
    setFieldValue(name, search);
  }, [search]);

  const renderItemGroup = (itemGroup: TAutocompleteDropdownItem[]) => (
    <FlatList
      data={itemGroup}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => (item && item.title ? handleItemClick(item.title) : null)}
        >
          <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const inputPropsPassed: Props = props;
  inputPropsPassed.onChangeText = onChangeTextInterceptor;

  return (
    <View style={styles.container}>
      <SearchBar
        onChangeText={onChangeTextInterceptor}
        value={value}
        onBlur={() => {
          onBlur(name);
          setFieldTouched(name);
        }}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        {...inputProps}
      />
      {renderItemGroup(list)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    paddingHorizontal: -5,
    marginTop: 10,
  },
  searchBarInputContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
  },
  allContainer: {
    height: 200,
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginHorizontal: 15,
    color: "red",
  },
});

export default Search;
