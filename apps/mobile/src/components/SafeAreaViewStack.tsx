import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export default function SafeAreaViewStack({ children }: Props) {
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20, }}>
      {children}
    </SafeAreaView>
  );
}
