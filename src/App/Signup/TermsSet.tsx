import { useNavigation } from "@react-navigation/native";
import CheckBox from "expo-checkbox";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

import { Container, TextButton } from "../../components/common";
import { NavigationProps } from "../../Navigator/Routes";

const TermsSet: React.FC = () => {
  const [checkList, setCheckList] = useState<string[]>([]);
  const [buttonColor, setButtonColor] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigation = useNavigation<NavigationProps>();

  const checkAll = (isChecked: boolean) => {
    if (isChecked) {
      setCheckList(["terms", "collect", "another", "community"]);
    } else {
      setCheckList([]);
    }
  };

  const check = (name: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckList([...checkList, name]);
    } else {
      setCheckList(checkList.filter(choice => choice !== name));
    }
  };

  const toggleExpansion = (item: string) => {
    if (expandedItems.includes(item)) {
      setExpandedItems(expandedItems.filter(i => i !== item));
    } else {
      setExpandedItems([...expandedItems, item]);
    }
  };

  useEffect(() => {
    if (
      checkList.includes("terms") &&
      checkList.includes("collect") &&
      checkList.includes("another") &&
      checkList.includes("community")
    ) {
      setButtonColor(true);
    } else {
      setButtonColor(false);
    }
  }, [checkList]);

  return (
    <Container
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingTop: 30,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          checkAll(checkList.length != 4);
        }}
      >
        <Container style={{ flexDirection: "row", marginBottom: 15 }}>
          <CheckBox value={checkList.length === 4} onValueChange={checkAll}></CheckBox>
          <Text style={{ marginLeft: 10 }}>이용약관 전체동의</Text>
        </Container>
      </TouchableOpacity>

      <Container style={{ borderWidth: 2, borderColor: "#6666", padding: 10 }}>
        <Container paddingHorizontal={2}>
          <TouchableOpacity onPress={() => toggleExpansion("terms")}>
            <Container style={{ flexDirection: "row" }}>
              <CheckBox
                value={checkList.includes("terms")}
                onValueChange={isChecked => check("terms", isChecked)}
              ></CheckBox>
              <Text style={{ marginLeft: 10 }}>[필수] 개인정보 수집 및 이용 동의</Text>
            </Container>
          </TouchableOpacity>
          {expandedItems.includes("terms") && (
            <Text style={{ padding: 5 }}>
              개인정보 수집 이용 동의서 1. 수집하는 개인정보 항목 학교, 학과, 학번 2. 개인정보의
              수집 및 이용 목적 제공하신 정보는 과끼리 앱 사용 확인을 위해 사용합니다. 본인 확인
              식별 (동명이인 등) 절차에 이용(학교, 학과,학번) 2의사소통 및 정보 전달 등에 이용
              (학교,학과,학번) 3. 개인정보의 보유 및 이용기간 수집된 개인정보의 보유 기간은
              &lt;과끼리&gt; 사용 후 탈퇴 시, 당사자는 개인정보를 재생 불가능한 방법으로 즉시
              파기합니다. 귀하는 이에 대한 동의를 거부할 수 있습니다. 다만 동의가 없을 경우
              &lt;과끼리&gt; 사용이 불가능할 수도 있음을 알려드립니다.
            </Text>
          )}
        </Container>
        <Container paddingHorizontal={2}>
          <TouchableOpacity onPress={() => toggleExpansion("another")}>
            <Container style={{ flexDirection: "row" }}>
              <CheckBox
                value={checkList.includes("another")}
                onValueChange={isChecked => check("another", isChecked)}
              ></CheckBox>
              <Text style={{ marginLeft: 10 }}>[필수] 과끼리 이용약관</Text>
            </Container>
          </TouchableOpacity>
          {expandedItems.includes("another") && (
            <Text style={{ padding: 5 }}>
              개인정보 보호법에 따라 과끼리에 회원가입을 신청하시는 분께 수집하는 개인정보의 항목,
              개인정보의 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간, 동의
              거부권 및 동의 거부 시 불이익에 관한 사항을 안내드리오니 자세히 읽은 후 동의하여
              주시기 바랍니다.
            </Text>
          )}
        </Container>
        <Container paddingHorizontal={2}>
          <TouchableOpacity onPress={() => toggleExpansion("community")}>
            <Container style={{ flexDirection: "row" }}>
              <CheckBox
                value={checkList.includes("community")}
                onValueChange={isChecked => check("community", isChecked)}
              />
              <Text style={{ marginLeft: 10 }}>[필수] 커뮤니티 이용수칙 확인</Text>
            </Container>
          </TouchableOpacity>

          {expandedItems.includes("community") && (
            <Text style={{ padding: 5 }}>
              개인정보 보호법에 따라 과끼리에 회원가입을 신청하시는 분께 수집하는 개인정보의 항목,
              개인정보의 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간, 동의
              거부권 및 동의 거부 시 불이익에 관한 사항을 안내드리오니 자세히 읽은 후 동의하여
              주시기 바랍니다.
            </Text>
          )}
        </Container>
      </Container>
      <TextButton
        style={{
          backgroundColor: "#5299EB",
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 30,
          marginTop: 40,
          opacity: buttonColor ? 1 : 0.5,
        }}
        textAlign={"center"}
        fontColor={"white"}
        fontSize={14}
        disabled={!buttonColor}
        onPress={() => {
          navigation.navigate("Signup");
        }}
      >
        다음
      </TextButton>
    </Container>
  );
};

export default TermsSet;
