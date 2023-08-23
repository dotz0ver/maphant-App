import { useHeaderHeight } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import { LegacyRef, useEffect, useState } from "react";
import {
  ColorValue,
  Dimensions,
  Image,
  ImageSourcePropType,
  ImageStyle,
  InputModeOptions,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

// 컴포넌트들에 대한 타입 정의를 함
// 각 컴포넌트가 어떤 props를 받을 수 있는지, 해당 props들이 어떤 타입을 가져야 하는지

// style 이름의 ViewStyle 타입의 props를 가질 수 있는 객체 타입
type EmptyProps = {
  style?: StyleProp<ViewStyle>;
};
// size 이름의 숫자 타입 props를 가지며, EmptyProps 상속함
type SpacerProps = {
  size?: number;
} & EmptyProps;
// padding..., border 등 이름의 숫자 타입 props를 가지며, EmptyProps 상속함
type DefaultProps = {
  paddingHorizontal?: number;
  paddingVertical?: number;
  borderRadius?: number;
} & EmptyProps;
// widthFull 이름의 부울 타입의 props와 onPress 이름의 함수 타입의 props
type ButtonProps = {
  widthFull?: boolean; // width를 직접 설정하고 싶으면 style을 사용할 것
  onPress: () => void;
} & DefaultProps;
// font..., 등 이름의 색상과 숫자 타입 props를 가지며 ButtonProps와 ChildrenProps 상속함
type TextButtonProps = {
  fontSize?: number;
  fontColor?: ColorValue;
  backgroundColor?: ColorValue;
  activeOpacity?: number;
  disabled?: boolean;
  textAlign?: string;
  opacity?: number;
} & ButtonProps &
  ChildrenProps;

// children 이름의 ReactNode 또는 ReactNode[] 타입 props
type ChildrenProps = {
  children: React.ReactNode | React.ReactNode[];
} & DefaultProps;
// 부울 타입 props
type ContainerProps = {
  isFullScreen?: boolean;
  isFullWindow?: boolean;
  isItemCenter?: boolean;
  isForceKeyboardAvoiding?: boolean;
  isForceTopSafeArea?: boolean;
} & ChildrenProps;
// 문자열과 함수, 부울 타입의 props
type InputProps = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
  inputMode?: InputModeOptions;
  keyboardType?: KeyboardTypeOptions;
  ref?: LegacyRef<TextInput>;
  multiline?: boolean;
  inputRef?: LegacyRef<TextInput>;
  onSubmitEditing?: () => void;
} & DefaultProps;

type IconButtonProps = {
  flexDirection?: "row" | "column";
  marginHorizontal?: number;
  name: string;
  color?: ColorValue;
  size?: number;
  fontSize?: number;
  fontColor?: ColorValue;
} & TextButtonProps;

const Container: React.FC<ContainerProps> = props => {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  //props 기본값
  const {
    style = {},
    children,
    paddingHorizontal,
    paddingVertical = 8,
    isFullScreen = false,
    isFullWindow = false,
    isItemCenter = false,
    isForceKeyboardAvoiding = false,
    isForceTopSafeArea = false,
    borderRadius,
  } = props;
  const isRootContainer = isFullScreen || isFullWindow;

  // 커스텀으로 값 가져옴
  const headerHeight = useHeaderHeight();
  // 컨테이너 높이 결정 함수
  const adjustedHeight = () => {
    if (isFullScreen) return Dimensions.get("screen").height;
    if (isFullWindow) return Dimensions.get("window").height - headerHeight;
    return Dimensions.get("window").height;
  };
  // 높이와 키보드 높이를 상태로 관리
  const [height, setHeight] = useState<number | string>(adjustedHeight());
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  // 컴포넌트 마운트될 때, 높이와 키보드 높이 설정 이벤트 리스너 추가
  useEffect(() => {
    // 기기의 화면 크기마다 컨테이너 높이 변경
    Dimensions.addEventListener("change", () => {
      setHeight(adjustedHeight());
    });
    // 키보드가 나타났을 때
    Keyboard.addListener("keyboardDidShow", e => {
      setHeight(adjustedHeight() - e.endCoordinates.height);
      setKeyboardHeight(e.endCoordinates.height); // 업데이트
    });
    // 키보드가 사라졌을 때
    Keyboard.addListener("keyboardDidHide", () => {
      setHeight(adjustedHeight);
      setKeyboardHeight(0); // 초기화
    });
  }, []);

  let paddingBottom = 0;
  if (isForceKeyboardAvoiding) paddingBottom = 10;
  if (isFullWindow) paddingBottom += safeAreaInsets.bottom;

  const style_computed: StyleProp<ViewStyle> = {
    backgroundColor: isRootContainer ? theme.colors.background : "transparent",
    paddingHorizontal: isRootContainer && paddingHorizontal === undefined ? 16 : paddingHorizontal,
    paddingVertical,
    minHeight: isFullScreen || isFullWindow ? height : undefined,
    height: isForceKeyboardAvoiding ? height : undefined,
    marginLeft: isItemCenter ? "auto" : undefined,
    marginRight: isItemCenter ? "auto" : undefined,
    borderRadius,
    paddingBottom: paddingBottom,
    paddingTop: isFullScreen || isForceTopSafeArea ? safeAreaInsets.top : undefined,
    ...(style as object),
  };

  if (isRootContainer) {
    return (
      <KeyboardAvoidingView>
        <View style={style_computed}>{children}</View>
      </KeyboardAvoidingView>
    );
  }
  // if children is ScrollView, set minHeight
  if (children && (children as React.ReactElement).type === ScrollView) {
    (children as React.ReactElement).props.style = {
      minHeight: height,
    };
  }

  return <View style={style_computed}>{children}</View>;
};

type ImageBoxProps = {
  source: ImageSourcePropType;
  isCenter?: boolean;
  width?: number;
  height?: number;
} & DefaultProps;

const ImageBox: React.FC<ImageBoxProps> = props => {
  const { source, isCenter = false, style = {}, width, height, borderRadius } = props;

  const style_container = {
    alignItems: isCenter ? "center" : undefined,
    justifyContent: isCenter ? "center" : undefined,
    ...(style as object),
  } as StyleProp<ViewStyle>;

  const style_image: StyleProp<ImageStyle> = {
    width,
    height,
    borderRadius,
  };

  if (width && !height) {
    const img = Image.resolveAssetSource(source);
    style_image.height = (width / img.width) * img.height;
  } else if (!width && height) {
    const img = Image.resolveAssetSource(source);
    style_image.width = (height / img.height) * img.width;
  }

  return (
    <View style={style_container}>
      <Image source={source} style={style_image} />
    </View>
  );
};

// size prop에 따라 높이를 가진 빈 view 렌더링
const Spacer: React.FC<SpacerProps> = props => {
  const { size = 8, style = {} } = props;

  const style_computed: StyleProp<ViewStyle> = {
    height: size,
    ...(style as object),
  };

  return <View style={style_computed}></View>;
};

const TextButton: React.FC<TextButtonProps> = props => {
  const {
    style = {},
    children,
    backgroundColor = "#5299EB",
    fontSize = 16,
    fontColor = "white",
    widthFull = false,
    paddingHorizontal = 20,
    paddingVertical = 15,
    borderRadius = 100,
    activeOpacity,
    onPress,
    disabled = false,
    opacity,
  } = props;

  const style_container: StyleProp<ViewStyle> = {
    opacity,
    paddingHorizontal,
    paddingVertical,
    backgroundColor,
    borderRadius,
    alignItems: "center",
    justifyContent: "center",
    ...(style as object),
  };
  const style_text: StyleProp<TextStyle> = {
    fontSize,
    textAlign: "center",
    color: fontColor,
  };

  if (widthFull) {
    style_container.width = "100%";
    style_container.alignItems = "center";
  }

  return (
    <TouchableOpacity
      style={style_container}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
    >
      <Text style={style_text}>{children}</Text>
    </TouchableOpacity>
  );
};
const Input: React.FC<InputProps> = props => {
  const theme = useTheme();
  const {
    style = {},
    ref,
    placeholder = "",
    onChangeText,
    value,
    keyboardType,
    inputRef,
    secureTextEntry = false,
    editable = true,
    paddingHorizontal = 16,
    paddingVertical = 8,
    borderRadius = 16,
    inputMode = "text",
    multiline = false,
    onSubmitEditing,
  } = props;

  const style_container: StyleProp<ViewStyle> = {
    paddingHorizontal,
    paddingVertical,
    backgroundColor: theme.colors.card,
    borderRadius,
    ...(style as object),
  };
  const style_text: StyleProp<TextStyle> = {
    fontSize: 16,
    // color: theme.colors.text,
  };

  return (
    <View style={style_container}>
      <TextInput
        ref={inputRef}
        style={style_text}
        value={value}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        inputMode={inputMode}
        multiline={multiline}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
};

type TextThemedPropsType = {
  onDarkColor?: ColorValue;
  onLightColor?: ColorValue;
} & TextProps;

const TextThemed: React.FC<TextThemedPropsType> = props => {
  const theme = useTheme();
  const textColor = (theme.dark ? props.onDarkColor : props.onLightColor) ?? theme.colors.text;

  const propsPassed = { ...props };
  propsPassed.style = { color: textColor, ...(props.style as object) };

  return <Text {...propsPassed} />;
};

const IconButton: React.FC<IconButtonProps> = props => {
  const {
    style = {},
    children,
    backgroundColor = "#f2f2f2",
    paddingHorizontal = 11,
    paddingVertical = 5,
    marginHorizontal = 4,
    borderRadius = 5,
    flexDirection = "row",
    onPress,
    fontSize = 9,
    fontColor,
    name,
    color,
    size = 15,
  } = props;

  const style_container: StyleProp<ViewStyle> = {
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    backgroundColor,
    borderRadius,
    flexDirection,
    alignItems: "center",
    justifyContent: "center",
    ...(style as object),
  };
  const style_text: StyleProp<TextStyle> = {
    fontSize,
    textAlign: "center",
    color: fontColor,
    marginLeft: 5,
  };
  return (
    <TouchableOpacity style={style_container} onPress={onPress}>
      <Icon name={name} color={color} size={size} />
      <Text style={style_text}>{children}</Text>
    </TouchableOpacity>
  );
};
export { Container, IconButton, ImageBox, Input, Spacer, TextButton, TextThemed };
