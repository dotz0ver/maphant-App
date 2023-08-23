import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { StyleSheet } from "react-native";

interface CustomInputProps {
  field: {
    name: string;
    onBlur: (name: string) => void;
    value: string; // value의 타입은 구체적으로 지정해야 합니다.
    // 다른 필요한 필드 프로퍼티들을 추가할 수 있습니다.
  };
  form: {
    errors: Record<string, string>; // errors 객체의 타입은 구체적으로 지정해야 합니다.
    touched: Record<string, boolean>; // touched 객체의 타입은 구체적으로 지정해야 합니다.
    setFieldValue: (name: string, value: string) => void; // setFieldValue의 타입은 구체적으로 지정해야 합니다.
    setFieldTouched: (name: string) => void; // setFieldTouched의 타입은 구체적으로 지정해야 합니다.
    // 다른 필요한 form 프로퍼티들을 추가할 수 있습니다.
  };
}
const CustomInput = (props: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (value: string, setter: any) => {
    setter(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  const {
    field: { name, onBlur, value },
    form: { errors, touched, setFieldValue, setFieldTouched },
    ...inputProps
  } = props;
  const hasError = errors[name] && touched[name];
  const placeholderTextColor = "#636363";

  let debounce_lastTime = Date.now();
  let debounce_timer: string | number | NodeJS.Timeout | undefined;

  function debounce(func: () => void, delay = 500) {
    const now = Date.now();
    debounce_timer && clearTimeout(debounce_timer);

    if (now - debounce_lastTime < delay) {
      debounce_timer = setTimeout(() => {
        debounce(func, delay);
      }, delay);

      return;
    }

    debounce_lastTime = now;
    func();
  }

  function saveInput() {
    console.log("Saving data to the server");
  }

  const processChange = () => debounce(() => saveInput());

  return (
    <View>
      <Text
        style={[
          styles.label,
          {
            top: isFocused ? 5 : 20,
            fontSize: isFocused ? 12 : 16,
            color: isFocused ? "#000" : "#aaa",
          },
        ]}
      >
        {name}
      </Text>
      <TextInput
        style={{ ...styles.input, marginTop: isFocused ? 25 : 20 }}
        value={value}
        placeholderTextColor={placeholderTextColor}
        onChangeText={text => {
          handleInputChange(text, setFieldValue);
          setFieldValue(name, text);
        }}
        onBlur={() => {
          handleBlur();
          onBlur(name);
          setFieldTouched(name);
        }}
        onFocus={handleFocus}
        keyboardType={name === "phoneNumber" || name === "studentNumber" ? "numeric" : "default"}
        secureTextEntry={name === "password" || name === "confirmPassword"}
        onKeyPress={processChange}
        {...inputProps}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  label: {
    position: "absolute",
    left: 10,
    fontSize: 16,
    color: "#aaa",
    backgroundColor: "transparent",
  },
  errorText: {
    fontSize: 12,
    marginHorizontal: 15,
    color: "red",
  },
});

export default CustomInput;
