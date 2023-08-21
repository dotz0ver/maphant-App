import { Feather, FontAwesome } from "@expo/vector-icons";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

import { GetAPI } from "../../Api/fetchAPI";
import { Container, ImageBox, Spacer, TextThemed } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";
import UserStorage from "../../storage/UserStorage";
import { BoardArticle } from "../../types/Board";
import { UserCategory } from "../../types/User";
import { ThemeContext } from "../Style/ThemeContext";

interface Tags {
  id: string | undefined;
  title: string | undefined;
}
// type homeScreenProps = NativeStackScreenProps

const Home: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [info, setInfo] = useState<[ImageSourcePropType, () => void][]>([
    [require("../../../assets/image1.jpg"), () => {}],
    [require("../../../assets/image2.jpg"), () => {}],
    [require("../../../assets/image3.jpg"), () => {}],
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (refreshing) {
      const timeout = setTimeout(() => {
        setRefreshing(false);
        setKey(prevKey => prevKey + 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [refreshing]);

  return (
    //view화면
    <Container key={key} isForceTopSafeArea={true} paddingHorizontal={0}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <MainHeader />
        <SearchBar text={text} onTextChanged={setText} />
        <Carousel imageList={info} />
        <Spacer size={20} />
        <TodaysHot />
        <Spacer size={40} />
        <HotPost />

        <Spacer size={20} />
      </ScrollView>
    </Container>
  );
};

const MainHeader: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const styles = StyleSheet.create({
    titleContainer: {
      height: 60,
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: "3%",
      paddingRight: "3%",
    },
    iconContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  });

  const [isDark, setIsDark] = useContext(ThemeContext);

  const changeMode = useCallback(() => {
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <View style={styles.titleContainer}>
      <HeaderCategory />
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
          }}
          onPress={changeMode}
        >
          <Icon
            name="moon-outline"
            size={30}
            color="#666666"
            style={{
              marginRight: "5%",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: "center",
          }}
        >
          <Icon
            name="notifications-outline"
            size={30}
            color="#666666"
            style={{
              marginRight: "5%",
            }}
            onPress={() => {
              navigation.navigate("alarm", 10);
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HeaderCategory: React.FC = () => {
  const currentCategory = useSelector(UserStorage.userCategorySelector);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [userCategoryList, setUserCategoryList] = useState<UserCategory[]>([]);
  const [categoryChanged, setCategoryChanged] = useState<boolean>(false);
  const profile = useSelector(UserStorage.userProfileSelector);

  const styles = StyleSheet.create({
    titleText: {
      fontSize: 35,
      marginLeft: "4%",
      fontWeight: "bold",
    },
  });

  useEffect(() => {
    UserStorage.listUserCategory().then(list => setUserCategoryList(list));
  }, [profile]);

  const snapPoints = useMemo(() => ["25%", "60%"], []);
  const onCategoryPress = useCallback((item: UserCategory) => {
    UserStorage.setUserCategoryCurrent(item);
    bottomSheetRef.current?.dismiss();
    setCategoryChanged(!categoryChanged);
  }, []);

  const renderItem = useCallback(({ item }: { item: UserCategory }) => {
    const style_text: StyleProp<TextStyle> = {
      fontSize: 16,
      fontWeight: Object.is(item, currentCategory) ? "bold" : "normal",
    };

    return (
      <TouchableOpacity
        onPress={() => {
          onCategoryPress(item);
        }}
      >
        <Text style={style_text}>
          {item.majorName} ({item.categoryName})
        </Text>
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  // render

  return (
    <Pressable
      onPress={() => {
        bottomSheetRef.current?.present();
      }}
    >
      <TextThemed style={styles.titleText}>
        {currentCategory?.majorName ?? "학과정보 없음"}
      </TextThemed>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        style={{ paddingHorizontal: 16 }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>계열·학과를 선택해 주세요</Text>
        <Spacer size={20} />
        <BottomSheetFlatList
          data={userCategoryList}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
        />
      </BottomSheetModal>
    </Pressable>
  );
};

const SearchBar: React.FC<{ text: string; onTextChanged: (text: string) => void }> = props => {
  const { text, onTextChanged } = props;

  const styles = StyleSheet.create({
    searchContainer: {
      height: 60,
      flexDirection: "row",
      justifyContent: "center",
    },
    searchBox: {
      flex: 1,
      flexDirection: "row",
      marginTop: "2.5%",
      marginBottom: "2.5%",
      marginLeft: "5%",
      marginRight: "5%",
      paddingLeft: "3%",
      paddingRight: "3%",
      backgroundColor: "#D8E1EC",
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <View>
          <Icon name="search" size={25} color="#666666" style={{}} />
        </View>
        <TextInput
          value={text}
          onChangeText={onTextChanged}
          returnKeyType="search"
          onEndEditing={() => console.log("Search Text Update Done")}
          style={{
            flex: 1,
            height: "100%",
            marginLeft: "3%",
            marginRight: "3%",
          }}
        />
        <TouchableOpacity onPress={() => onTextChanged("")}>
          <Icon name="close" size={25} color="#666666" style={{}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Carousel: React.FC<{ imageList: [ImageSourcePropType, () => void][] }> = props => {
  const { imageList } = props;
  const [currentinfoPage, setCurrentinfoPage] = useState(0);
  const infoPageCount = 3; // 페이지

  const SCREEN_WIDTH = useWindowDimensions().width;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const infoPage = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentinfoPage(infoPage);
  };

  const CreateInfoView: React.FC<{
    imageList: [ImageSourcePropType, () => void][];
    currentPage: number;
  }> = props => {
    const { imageList, _currentPage } = props;
    return (
      <>
        {imageList.map(([image, action], idx) => (
          <Pressable key={idx} onPress={action} style={{ paddingHorizontal: 16, height: 250 }}>
            <ImageBox source={image} width={SCREEN_WIDTH - 16 * 2} height={250} borderRadius={8} />
          </Pressable>
        ))}
      </>
    );
  };

  const styles = StyleSheet.create({
    infoDotBox: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 10,
    },
    infoDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "gray",
      marginHorizontal: 5,
    },
    activeinfoDot: {
      backgroundColor: "#5299EB",
    },
    unactiveinfoDot: {
      backgroundColor: "#CBD7E6",
    },
  });

  return (
    <View>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ borderRadius: 18 }}
      >
        <CreateInfoView imageList={imageList} currentPage={currentinfoPage} />
      </ScrollView>

      <View style={styles.infoDotBox}>
        {Array.from({ length: infoPageCount }, (_, index) => (
          <View
            key={index}
            style={[
              styles.infoDot,
              index === currentinfoPage ? styles.activeinfoDot : styles.unactiveinfoDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const TodaysHot: React.FC = () => {
  // * HotTags
  const [tags, setTags] = useState<Tags[]>([
    { id: "1", title: "#오정민" }, //초기값 설정
    { id: "2", title: "#앗뜨거 앗뜨" },
    { id: "3", title: "#부트캠프" },
    { id: "4", title: "#React" },
    { id: "5", title: "#React-Native" },
    { id: "6", title: "Node.js" },
    { id: "7", title: "과끼리" },
    { id: "8", title: "Tovelop" },
  ]);

  const createTagView = (tag: Tags, index: number) => {
    const colors = [
      "#FFC0CB",
      "#B5EEEA",
      "#CCCCCC",
      "#FFA07A",
      "#FFD700",
      "#ADFF2F",
      "#00FFFF",
      "#EE82EE",
      "#FFFF00",
    ];
    return (
      <View
        key={tag.id}
        style={{
          flex: 1,
          backgroundColor: colors[index % colors.length],
          justifyContent: "flex-start",
          alignItems: "center",
          marginLeft: 4,
          paddingVertical: 8,
          paddingHorizontal: 12,
          height: 36,
          borderRadius: 30,
        }}
      >
        <Text>{tag.title}</Text>
      </View>
    );
  };

  function mapTag() {
    return tags.map((tag, index) => createTagView(tag, index));
  }

  const styles = StyleSheet.create({
    todaysHotTitleBox: {
      padding: 16,
      flex: 1,
      flexDirection: "row",
      //backgroundColor: "skyblue",
      alignItems: "center",
    },

    todaysHotTitleText: {
      fontSize: 25,
      fontWeight: "bold",
    },
    todaysHotTagBox: {
      flex: 1,
      flexDirection: "row",
      //backgroundColor: "purple",
    },
  });

  return (
    <View>
      <View style={styles.todaysHotTitleBox}>
        <TextThemed style={styles.todaysHotTitleText}> 🔥오늘의</TextThemed>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "red",
          }}
        >
          {" "}
          HOT
        </Text>
        <TextThemed style={styles.todaysHotTitleText}> 키워드🔥</TextThemed>
      </View>

      <ScrollView
        horizontal={true}
        keyboardDismissMode="none"
        showsHorizontalScrollIndicator={false}
        style={styles.todaysHotTagBox}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {mapTag()}
      </ScrollView>
    </View>
  );
};

const HotPost: React.FC = () => {
  const [hotPost, setHotPost] = useState<BoardArticle[]>([]);
  const category = useSelector(UserStorage.userCategorySelector);

  const navigation = useNavigation();

  useEffect(() => {
    GetAPI("/board/hot?&page=1&recordSize=2")
      .then(res => {
        if (res.success === true) {
          setHotPost(res.data.list);
        }
      })
      .catch(err => {
        alert("서버 오류 \n" + err);
      });
  }, [category]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const detailContent = (boardId: number) => {
    navigation.navigate("BoardDetail", { id: boardId });
  };

  const styles = StyleSheet.create({
    hotPostBox: {
      height: 340,
      borderWidth: 1,
      borderColor: "#d1d1d1",
      borderRadius: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    boxTitleBox: {
      height: 50,
      justifyContent: "center",
    },
    boxTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginLeft: 20,
    },
    line: {
      borderWidth: 0.7,
      borderColor: "#d1d1d1",
      marginLeft: 20,
      marginRight: 20,
    },
    postBox: {
      height: 143,
      marginLeft: 20,
      marginRight: 20,
      // backgroundColor: "skyblue",
    },
    nameAndtypeBox: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 10,
      paddingRight: 10,
    },
    profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
      borderWidth: 1,
    },
    textContainer: {
      flexDirection: "row",
    },

    userNickname: {
      fontSize: 15,
      fontWeight: "bold",
      // backgroundColor: "pink",
    },
    boardType: {
      fontSize: 15,
      color: "gray",
      marginLeft: "60%",
    },
    titleAndbodyBox: {
      height: 60,
      //backgroundColor: "skyblue",
    },
    postTitle: {
      fontSize: 15,
      fontWeight: "bold",
    },
    postBody: {
      fontSize: 15,
      marginLeft: 5,
      // backgroundColor: "pink",
    },
    tagsBox: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 5,
    },
    tags: {
      fontSize: 15,
      color: "red",
      // backgroundColor: "skyblue",
    },
    timeAndlikeAndcomment: {
      flexDirection: "row",
      // backgroundColor: "pink",
      alignItems: "center",
      height: 25,
    },
    likeTextWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
    },
    commentTextWrapper: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconText: {
      marginLeft: 4,
    },
    timeTextWrapper: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: "60%",
    },
    noHotPostBox: {
      height: 290,
      justifyContent: "center",
      alignItems: "center",
    },
    noHotPostText: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

  if (hotPost.length === 0) {
    return (
      <View style={styles.hotPostBox}>
        <View style={styles.boxTitleBox}>
          <Text style={styles.boxTitle}>Hot 게시글</Text>
        </View>
        <View style={styles.line}></View>
        <View style={styles.noHotPostBox}>
          <Text style={styles.noHotPostText}>게시글이 존재하지 않습니다</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.hotPostBox}>
      <View style={styles.boxTitleBox}>
        <Text style={styles.boxTitle}>Hot 게시글</Text>
      </View>

      <View style={styles.line}></View>

      <Pressable style={styles.postBox} onPress={() => detailContent(hotPost[0].boardId)}>
        <Spacer size={10} />

        <View style={styles.nameAndtypeBox}>
          <Image
            source={{ uri: "https://tovelope.s3.ap-northeast-2.amazonaws.com/image_1.jpg" }}
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.userNickname}>{hotPost[0].userNickname}</Text>
            <Text style={styles.boardType}>{hotPost[0].type}</Text>
          </View>
        </View>

        <Spacer size={5} />
        <View style={styles.titleAndbodyBox}>
          <Text style={styles.postTitle}>{truncateText(hotPost[0].title, 20)}</Text>
          <Spacer size={2} />
          <Text style={styles.postBody}>{truncateText(hotPost[0].body, 25)}</Text>
          <Spacer size={4} />
          <View style={styles.tagsBox}>
            {hotPost[0].tags && hotPost[0].tags.length > 0 ? (
              hotPost[0].tags.slice(0, 3).map((tag, index) => (
                <Text style={styles.tags} key={index}>
                  #{tag}{" "}
                </Text>
              ))
            ) : (
              <View />
            )}
            {hotPost[0].tags && hotPost[0].tags.length > 3 && <Text style={styles.tags}>...</Text>}
          </View>
        </View>

        <Spacer size={5} />
        <View style={styles.timeAndlikeAndcomment}>
          <View style={styles.likeTextWrapper}>
            <Feather name="thumbs-up" size={13} color="tomato" />
            <Text style={styles.iconText}>{hotPost[0].likeCnt}</Text>
          </View>
          <View style={styles.commentTextWrapper}>
            <FontAwesome name="comment-o" size={13} color="blue" />
            <Text style={styles.iconText}>{hotPost[0].commentCnt}</Text>
          </View>
          <View style={styles.timeTextWrapper}>
            <Text>{dateToString(hotPost[0].createdAt)}</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.line}></View>

      <Pressable style={styles.postBox} onPress={() => detailContent(hotPost[1].boardId)}>
        <Spacer size={10} />
        <View style={styles.nameAndtypeBox}>
          <Image
            source={{ uri: "https://tovelope.s3.ap-northeast-2.amazonaws.com/image_1.jpg" }}
            style={styles.profileImage}
          />
          <View style={styles.textContainer}>
            <Text style={styles.userNickname}>{hotPost[1].userNickname}</Text>
            <Text style={styles.boardType}>{hotPost[1].type}</Text>
          </View>
        </View>

        <Spacer size={5} />
        <View style={styles.titleAndbodyBox}>
          <Text style={styles.postTitle}>{truncateText(hotPost[1].title, 20)}</Text>
          <Spacer size={2} />
          <Text style={styles.postBody}>{truncateText(hotPost[1].body, 25)}</Text>
          <Spacer size={4} />
          <View style={styles.tagsBox}>
            {hotPost[0].tags && hotPost[0].tags.length > 0 ? (
              hotPost[0].tags.slice(0, 3).map((tag, index) => (
                <Text style={styles.tags} key={index}>
                  #{tag}{" "}
                </Text>
              ))
            ) : (
              <View />
            )}
            {hotPost[0].tags && hotPost[0].tags.length > 3 && <Text style={styles.tags}>...</Text>}
          </View>
        </View>

        <Spacer size={5} />
        <View style={styles.timeAndlikeAndcomment}>
          <View style={styles.likeTextWrapper}>
            <Feather name="thumbs-up" size={13} color="tomato" />
            <Text style={styles.iconText}>{hotPost[1].likeCnt}</Text>
          </View>
          <View style={styles.commentTextWrapper}>
            <FontAwesome name="comment-o" size={13} color="blue" />
            <Text style={styles.iconText}>{hotPost[1].commentCnt}</Text>
          </View>
          <View style={styles.timeTextWrapper}>
            <Text>{dateToString(hotPost[1].createdAt)}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
function dateToString(date: string): string {
  const start = new Date(date);
  const end = new Date();

  const diff = end.getTime() - start.getTime();
  const diffDate = new Date(diff);

  const year = diffDate.getFullYear() - 1970;
  const month = diffDate.getMonth();
  const day = diffDate.getDate() - 1;
  const hour = diffDate.getHours();
  const minute = diffDate.getMinutes();
  const second = diffDate.getSeconds();

  if (year > 0) return `${year}년 전`;
  if (month > 0) return `${month}달 전`;
  if (day > 0) return `${day}일 전`;
  if (hour > 0) return `${hour}시간 전`;
  if (minute > 0) return `${minute}분 전`;
  if (second > 0) return `${second}초 전`;
  return "방금 전";
}

export default Home;
