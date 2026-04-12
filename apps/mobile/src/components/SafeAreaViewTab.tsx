import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export default function SafeAreaViewTab({ children }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8, }}>
      {children}
    </SafeAreaView>
  );
}
